import 'package:animate_do/animate_do.dart';
import 'package:bubble/bubble.dart';
import 'package:dash_chat/dash_chat.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_platform_widgets/flutter_platform_widgets.dart';
import 'package:medi_bot/data/chat_data.dart';
import 'package:medi_bot/utils/if_builder.dart';
import 'package:medi_bot/utils/navigator.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  static ChatUser theUser = ChatUser(name: "Ich", uid: "1");
  static ChatUser botUser = ChatUser(name: "MediBot", uid: "2");
  ChatData chatData = ChatData(messages: ["Hallo", ">>Hey! Wie geht es dir so?"]);

  var messages = [
    ChatMessage(text: "Hallo", user: theUser),
    ChatMessage(
      user: botUser,
      text: "Hallo! Wie geht es dir heute?",
      createdAt: DateTime.now(),
      quickReplies: QuickReplies(
        values: <Reply>[
          Reply(
            title: "😋 Gut",
            value: "Gut",
          ),
          Reply(
            title: "😞 Schlecht",
            value: "Schlecht",
          ),
        ],
      ),

    ),
  ];

  @override
  Widget build(BuildContext context) {
    return PlatformScaffold(
      appBar: PlatformAppBar(
        title: Text("MediBot"),
      ),
      body: DashChat(
        user: theUser,
        inputDisabled: true,
        timeFormat: DateFormat("HH:mm"),
        messages: messages,
        onSend: (chatMessage) {
          setState(() {
            messages.add(chatMessage);
          });
        },
      ),
    );
  }
}
