./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings
./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/.tapin.activities.SettingActivity
./adb uninstall com.google.zxing.client.android


./adb remount
./adb shell mv /system/app/SystemUI.odex /system/app/SystemUI.odexold
./adb shell mv /system/app/SystemUI.apk /system/app/SystemUI.apkold
./adb reboot