# Install
npm install -g bower
cordova platform add android
cordova plugin add com.chariotsolutions.nfc.plugin
bower install firebase angularfire flag-icon-css

# Build signed jar
keytool -genkey -v -keystore smartstadium-release-key.keystore -alias  -keyalg RSA -keysize 2048 -validity 10000
Passphrase : $mart$tadium
Password : $mart$tadium

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore smartstadium-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk smartstadium
~/Library/Android/sdk/build-tools/23.0.1/zipalign -v 4 /Users/zaid/IdeaProjects/smartstadium/mobile-app/platforms/android/build/outputs/apk/android-release-unsigned.apk /Users/zaid/IdeaProjects/smartstadium/mobile-app/platforms/android/build/outputs/apk/smartstadium.apk