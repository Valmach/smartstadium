cordova clean
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore smartstadium-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk smartstadium
~/Library/Android/sdk/build-tools/23.0.1/zipalign -v 4 /Users/zaid/IdeaProjects/smartstadium/mobile-app/platforms/android/build/outputs/apk/android-release-unsigned.apk /Users/zaid/IdeaProjects/smartstadium/mobile-app/platforms/android/build/outputs/apk/smartstadium.apk
