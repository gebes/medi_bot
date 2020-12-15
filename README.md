# MediBot🤖
THis is the source code for the challenge "Hackathon für gute KI #4GoodAI" 2020 - rewarded with the 2nd place.🥈

## The Project📃
You can find our project [here](https://medibot.at), where you can try out all the features.

## Features💻
This source code includes three seperate builds - one for android, one for IOS and one for web, that the app can be deployed anywhere.
Editing what the bot says and what it response is also made easy - you can edit the `dialog.txt` in the directory `assets`, that uses a simple syntax for a simple communication with premade answers.

## Requirements📌
Install Flutter & Dart for your OS by following [this guide](https://flutter.dev/docs/get-started/install).  
As IDE, you could use Visual Studio Code, IntelliJ or Android Studio. Optional you can download the Flutter plugin/extension in each IDE.

### How To Run the bot as app📱
1. Open the `medi_bot` folder in your IDE
2. Then run `flutter pub get` (may take a while) in the console
   * This downloads all required dependencies
3. Connect your Android or iOS device and make sure its unlocked
4. Execute `flutter run`
   * If you have multiple devices, you can run the app on all of those, by executing `flutter run -d all`
   * Optionally you can also add the `--release` parameter, which prevents flutter from starting the debug mode. The app will be published in this mode
5. Test the app on your device after it has built

### Run the Bot as a website💻
1. Open the `medi_bot` folder in your IDE
2. Then run `flutter pub get` (may take a while) in the console
   * This downloads all required dependencies
3. Execute `flutter config --enable-web`, then create a release by executing `flutter run -d web --release`

## What we learned💡
- Creating a chat bot from a simple file
- How to collaborate as a team
- How to use flutter for web-based builds
