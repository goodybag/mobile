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

#Set Preferences
./adb push /goodybag/mobile/tapin\ station/settings/settings.db /data/data/com.android.providers.settings/databases/settings.db; ./adb push /goodybag/mobile/tapin\ station/settings/settings.db-shm /data/data/com.android.providers.settings/databases/settings.db-shm; ./adb push /goodybag/mobile/tapin\ station/settings/settings.db-wal /data/data/com.android.providers.settings/databases/settings.db-wal; ./adb push /goodybag/mobile/tapin\ station/settings/accounts.db /data/system/accounts.db; ./adb push /goodybag/mobile/tapin\ station/settings/accounts.xml /data/system/sync/accounts.xml; ./adb push /goodybag/mobile/tapin\ station/settings/wpa_supplicant.conf /data/misc/wifi/wpa_supplicant.conf;

#Uninstall Goodybag TapIn Station, Launch Settings App, Install Goodybag TapIn Station, Launch Goodybag TapIn Station
./adb uninstall com.google.zxing.client.android; ./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings; ./adb install /goodybag/mobile/tapin\ station/android/android/bin/Goodybag\ TapIn\ Station.apk; ./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity