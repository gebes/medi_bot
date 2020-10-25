import 'package:animate_do/animate_do.dart';
import 'package:bubble/bubble.dart';
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
  ChatData chatData = ChatData(messages: ["Hallo", ">>Hey! Wie geht es dir so?"]);

  @override
  Widget build(BuildContext context) {
    return PlatformScaffold(
      appBar: PlatformAppBar(
        title: Text("MediBot"),
      ),
      body: GestureDetector(onTap: () {
        setState(() {
          chatData.messages.add(">>Gut danke");
        });
      }, child: _ChatWidget(chatData)),
    );
  }
}

class _ChatWidget extends StatelessWidget {
  final ChatData chatData;

  _ChatWidget(this.chatData);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: ListView(
        children: [for (String message in chatData.messages) _ChatBubble(message)],
      ),
    );
  }
}

class _ChatBubble extends StatelessWidget {
  static bool lastMessage = false;

  String message;

  _ChatBubble(this.message);

  @override
  Widget build(BuildContext context) {
    double pixelRatio = MediaQuery.of(context).devicePixelRatio;
    double px = 1 / pixelRatio;

    BubbleStyle styleSomebody = BubbleStyle(
      nip: BubbleNip.leftTop,
      color: Colors.white,
      elevation: 1 * px,
      margin: BubbleEdges.only(top: 8.0, right: 50.0),
      alignment: Alignment.bottomLeft,
    );
    BubbleStyle styleMe = BubbleStyle(
      nip: BubbleNip.rightTop,
      color: Color.fromARGB(255, 225, 255, 199),
      elevation: 1 * px,
      margin: BubbleEdges.only(top: 8.0, left: 50.0),
      alignment: Alignment.bottomRight,
    );

    double width = MediaQuery.of(context).size.width;
    String botString = ">>";
    bool isBot = message.startsWith(botString);
    return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Bubble(
          margin: BubbleEdges.only(top: 10),
          child: Text(
            isBot ? message.substring(botString.length) : message,
            textAlign: isBot ? TextAlign.left : TextAlign.right,
          ),
          style: isBot ? styleSomebody : styleMe,
        ),


    );
  }
}
