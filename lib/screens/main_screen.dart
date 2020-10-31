import 'dart:convert';
import 'dart:math';

import 'package:animate_do/animate_do.dart';
import 'package:bubble/bubble.dart';
import 'package:dash_chat/dash_chat.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_platform_widgets/flutter_platform_widgets.dart';
import 'package:medi_bot/data/chat_data.dart';
import 'package:medi_bot/utils/if_builder.dart';
import 'package:medi_bot/utils/navigator.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:indent/indent.dart';
import 'package:url_launcher/url_launcher.dart';

var kBoxShadow = [
  new BoxShadow(color: Colors.black.withAlpha(50), blurRadius: 4.0, offset: Offset(2, 3)),
];

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  static Future<String> getFileData(String path) async {
    return await rootBundle.loadString(path);
  }

  static String filterMessage(String string) {
    if (string.endsWith("\n")) {
      string = string.substring(0, string.length - 1);
    }

    return (string.split("\|")..shuffle()).first;
  }

  static Future _launch(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  static ChatUser theUser = ChatUser(name: "Ich", uid: "1");
  static ChatUser botUser = ChatUser(name: "MediBot", uid: "2", avatar: "https://i.imgur.com/ZrQy11C.png");

  ChatData chatData = ChatData(messages: ["Hallo", ">>Hey! Wie geht es dir so?"]);
  Map<String, String> sections = {};
  String currentSection = "1";
  List<ChatMessage> messages = [];

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future _init() async {
    await Future.delayed(Duration(seconds: 1));

    await _loadFile();

    sendCurrentSection();
  }

  Future _loadFile() async {
    String fileContent = await getFileData("assets/dialog.txt");

    var lines = LineSplitter().convert(fileContent);

    String current;
    for (String line in lines) {
      if (line.unindent().isEmpty) {
        continue;
      }
      print("${line.startsWith(" ")}: $line");
      if (!line.startsWith(" ")) {
        current = line;
        sections[current] = "";
      } else {
        if (sections[current].isEmpty) {
          sections[current] = line.unindent();
        } else {
          sections[current] = "${sections[current]}\n${line.unindent()}";
        }
      }
    }
  }

  void sendCurrentSection() async {
    List<String> messagesToSend = [];
    List<String> parsedReactions = [];

    for (String s in sections[currentSection].split("\n")) {
      if (s.isEmpty) continue;
      if (s.startsWith(">"))
        messagesToSend.add(s.substring(1).unindent());
      else
        parsedReactions.add(s);
    }

    for (String message in messagesToSend) {
      await Future.delayed(Duration(milliseconds: max(250 * messages.length, 1500)));
      List<Reply> replies = [];
      if (message == messagesToSend.last) {
        for (String r in parsedReactions) {
          Reaction reaction = Reaction.fromString(r);
          if (r.startsWith("A")) r = r.substring("A".length);
          replies.add(Reply(title: reaction.title, value: r));
        }
      }
      setState(() {
        messages.add(ChatMessage(text: filterMessage(message), user: botUser, quickReplies: QuickReplies(values: replies)));
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    var patterns = <MatchText>[
      MatchText(
          pattern: r"https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)",
          style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
          onTap: (String value) {
            _launch(value);
          }),
    ];
    return PlatformScaffold(
      appBar: PlatformAppBar(
        title: Text("MediBot"),
      ),
      body: DashChat(
        user: theUser,
        inputDisabled: true,
        timeFormat: DateFormat("HH:mm"),
        dateFormat: DateFormat("dd.MM.yyyy"),
        messages: messages,
        parsePatterns: patterns,
        quickReplyScroll: true,
        onQuickReply: (reply) async {
          Reaction reaction = Reaction.fromString(reply.value);
          setState(() {
            messages.add(ChatMessage(text: filterMessage(reaction.value), user: theUser));
            currentSection = reaction.next;
          });
          await Future.delayed(Duration(milliseconds: 250 * messages.length));
          setState(() {
            messages.add(ChatMessage(text: filterMessage(reaction.response), user: botUser));
          });
          sendCurrentSection();
        },
        messageDecorationBuilder: (chatMessage, isUser) {
          if (isUser) {
            return BoxDecoration(
              color: Colors.green,
              borderRadius: BorderRadius.circular(8),
              boxShadow: kBoxShadow,
            );
          } else {
            return BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: kBoxShadow,
            );
          }
        },
        avatarBuilder: (user) {
          if (user.avatar == null) return Container();
          return Container(
            width: 32,
            height: 32,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(32),
              child: Image.network(
                user.avatar,
                fit: BoxFit.fill,
              ),
            ),
            decoration: BoxDecoration(boxShadow: kBoxShadow, borderRadius: BorderRadius.circular(32)),
          );
        },
        messageTextBuilder: (text, [message]) {
          if (message.user == theUser) {
            return Text(
              text,
              style: TextStyle(color: Colors.white),
            );
          } else {
            return ParsedText(
              parse: patterns,
              text: message.text,
              style: TextStyle(
                color: message.user.color != null ? message.user.color : Colors.black87,
              ),
            );
          }
        },
        onSend: (ChatMessage) {},
      ),
    );
  }
}

class Reaction {
  String next, title, value, response;

  Reaction(this.next, this.title, this.value, this.response);

  Reaction.fromString(String s) {
    var splitted = s.split(r" - ");
    this.next = splitted[0];
    this.title = splitted[1];
    this.value = splitted[2];
    this.response = splitted[3];
  }
}
