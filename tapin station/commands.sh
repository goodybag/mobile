#Launch App
./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/.tapin.activities.SettingActivity

#Uninstall App
./adb uninstall com.google.zxing.client.android

#Launch Settings
./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings

#Restore Bar, Reboot
./adb remount; ./adb shell mv /system/app/SystemUI.odexold /system/app/SystemUI.odex; ./adb shell mv /system/app/SystemUI.apkold /system/app/SystemUI.apk; ./adb reboot

#Remove Bar, Reboot
./adb remount; ./adb shell mv /system/app/SystemUI.odex /system/app/SystemUI.odexold; ./adb shell mv /system/app/SystemUI.apk /system/app/SystemUI.apkold; ./adb reboot

#Uninstall Goodybag TapIn Station, Launch Settings App, Install Goodybag TapIn Station, Launch Goodybag TapIn Station
./adb uninstall com.google.zxing.client.android; ./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings; ./adb install /goodybag/mobile/tapin\ station/android/android/bin/SettingActivity.apk; ./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/.tapin.activities.SettingActivity