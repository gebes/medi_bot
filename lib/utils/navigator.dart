import 'package:flutter/material.dart';

import '../main.dart';

class AppNavigator {
  static void navigateTo(String route, {dynamic args}) {
    MediBotApp.navigatorKey.currentState.pushNamed(route, arguments: args);
  }

  static void pushReplacement(String route, {dynamic args}) {
    MediBotApp.navigatorKey.currentState.pushReplacementNamed(route, arguments: args);
  }

  static void clearAllAndNavigateTo(String route, {dynamic args}) {
    MediBotApp.navigatorKey.currentState.pushNamedAndRemoveUntil(route, (Route<dynamic> route) => false, arguments: args);
  }
}
