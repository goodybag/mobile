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
./adb uninstall com.google.zxing.client.android; ./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings; ./adb push /goodybag/mobile/tapin\ station/VERSION /data/gb/VERSION; ./adb install /goodybag/mobile/tapin\ station/android/android/bin/Goodybag\ TapIn\ Station.apk; ./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity;

#Install busybox, setup gb data directory, setup cron
./adb shell mount -o rw,remount -t yaffs2 /dev/block/nandd /system; ./adb shell mkdir -p /data/gb/scripts; ./adb push /goodybag/mobile/tapin\ station/update.sh /data/gb/scripts/update.sh; ./adb shell mkdir -p /system/xbin; ./adb push /goodybag/mobile/tapin\ station/busybox /system/xbin/busybox; ./adb shell chmod 755 /system/xbin/busybox; ./adb shell /system/xbin/busybox --install -s /system/xbin; ./adb shell crond ./adb shell ln -s /system/bin/ /bin; ./adb shell mount -o ro,remount -t yaffs2 /dev/block/nandd /system;