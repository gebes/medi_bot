# MediBot🤖
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/gebes/medi_bot)
![GitHub all releases](https://img.shields.io/github/downloads/gebes/medi_bot/total)
![GitHub contributors](https://img.shields.io/github/contributors/gebes/medi_bot)
![GitHub last commit](https://img.shields.io/github/last-commit/gebes/medi_bot)
![GitHub issues](https://img.shields.io/github/issues-raw/gebes/medi_bot)
![GitHub all releases](https://img.shields.io/github/downloads/gebes/medi_bot/total)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/gebes/medi_bot)
![GitHub language count](https://img.shields.io/github/languages/count/gebes/medi_bot)

Source code for the challenge "Hackathon für gute KI #4GoodAI" 2020 - rewarded with the 2nd place.🥈

## The Project📃
You can find our project [here](https://medibot.at), where you can try out all the features.

## Features💻
This source code includes three separate builds - one for android, one for IOS and one for web, which makes it a delight to deploy the app anywhere.
Editing what the bot says and its response is also made easy - you can edit the `dialog.txt` in the directory `assets`. The dialog.txt uses a simple syntax to create a dialogue with no effort.

## Requirements📌
Install Flutter & Dart for your OS by following [this guide](https://flutter.dev/docs/get-started/install).  
As IDE, you could use Visual Studio Code, IntelliJ or Android Studio. Optional you can download the Flutter plugin/extension in each IDE.

### How to run the bot as an app📱
1. Open the `medi_bot` folder in your IDE
2. Then run `flutter pub get` (may take a while) in the console
   * This downloads all required dependencies
3. Connect your Android or iOS device and make sure it is unlocked
4. Execute `flutter run`
   * If you have multiple devices, you can run the app on all of those, by executing `flutter run -d all`
   * Optionally you can also add the `--release` parameter, which prevents flutter from starting the debug mode. 
5. Test the app on your device after it has built

### Run the Bot as a website💻
1. Open the `medi_bot` folder in your IDE
2. Then run `flutter pub get` (may take a while) in the console
   * This downloads all required dependencies
3. Execute `flutter config --enable-web`, then create a release by executing `flutter run -d web --release`

## What we learned💡
- How to create a ChatBot with a custom Interpreter
- How to collaborate as a team
- How to use flutter for web-based builds
