import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_platform_widgets/flutter_platform_widgets.dart';
import 'package:medi_bot/screens/main_screen.dart';
import 'package:page_transition/page_transition.dart';

void main() {
  runApp(MediBotApp());
}

class MediBotApp extends StatelessWidget {
  static final navigatorKey = new GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context) {
    return PlatformApp(
      title: 'MediBot',
      home: MainScreen(),
      navigatorKey: navigatorKey,
      material: (_, __) => MaterialAppData(theme: ThemeData(primaryColor: Colors.green, primarySwatch: Colors.green), darkTheme: ThemeData.light()),
      cupertino: (_,__ )=> CupertinoAppData(theme: CupertinoThemeData(brightness: Brightness.light)),
      onGenerateRoute: (RouteSettings settings) {
        final args = settings.arguments;
        switch (settings.name) {
          case '/home':
            return PageTransition(type: PageTransitionType.fade, child: MainScreen(), duration: Duration(milliseconds: 500));

          default:
            return MaterialPageRoute(
              builder: (_) => Container(
                child: Text(settings.name),
              ),
            );
        }
      },
    );
  }
}
