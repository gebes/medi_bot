import 'package:flutter/material.dart';

class IfBuilder extends StatelessWidget {
  final Widget child;
  final bool statement;
  Widget Function(Widget child) builderTrue;
  Widget Function(Widget child) builderFalse;

  IfBuilder({this.child, this.statement, this.builderFalse, this.builderTrue});

  @override
  Widget build(BuildContext context) {
    return statement ? builderTrue(child) : builderFalse(child);
  }
}
