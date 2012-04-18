#Launch App
./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/.tapin.activities.SettingActivity;

#Uninstall App
./adb uninstall com.google.zxing.client.android;

#Launch Settings
./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings;

#Restore Bar, Reboot
./adb remount; ./adb shell mv /system/app/SystemUI.odexold /system/app/SystemUI.odex; ./adb shell mv /system/app/SystemUI.apkold /system/app/SystemUI.apk; ./adb reboot;

#Remove Bar, Reboot
./adb remount; ./adb shell mv /system/app/SystemUI.odex /system/app/SystemUI.odexold; ./adb shell mv /system/app/SystemUI.apk /system/app/SystemUI.apkold; ./adb reboot;

#Set Preferences
./adb push /goodybag/mobile/tapin\ station/settings/settings.db /data/data/com.android.providers.settings/databases/settings.db; ./adb push /goodybag/mobile/tapin\ station/settings/settings.db-shm /data/data/com.android.providers.settings/databases/settings.db-shm; ./adb push /goodybag/mobile/tapin\ station/settings/settings.db-wal /data/data/com.android.providers.settings/databases/settings.db-wal; ./adb push /goodybag/mobile/tapin\ station/settings/accounts.db /data/system/accounts.db; ./adb push /goodybag/mobile/tapin\ station/settings/accounts.xml /data/system/sync/accounts.xml; ./adb push /goodybag/mobile/tapin\ station/settings/wpa_supplicant.conf /data/misc/wifi/wpa_supplicant.conf;

#Uninstall Goodybag TapIn Station, Launch Settings App, Install Goodybag TapIn Station, Launch Goodybag TapIn Station
./adb uninstall com.google.zxing.client.android; ./adb shell am start -a android.intent.action.MAIN -n com.android.settings/.Settings; ./adb push /goodybag/mobile/tapin\ station/static/VERSION /data/gb/VERSION; ./adb install /goodybag/mobile/tapin\ station/android/android/bin/Goodybag\ TapIn\ Station.apk; ./adb shell am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity;









###Install busybox, setup gb data directory, setup cron###

#make /system writable
./adb shell mount -o rw,remount -t yaffs2 /dev/block/nandd /system;

#copy over scripts
./adb shell mkdir -p /data/gb/scripts;
./adb shell mkdir -p /data/gb/original/scripts;
./adb push /goodybag/mobile/tapin\ station/static/scripts /data/gb/scripts;
./adb push /goodybag/mobile/tapin\ station/static/scripts /data/gb/original/scripts;

#integrate into boot (modify existing preinstall.sh script - hack)
./adb push /goodybag/mobile/tapin\ station/static/preinstall.sh /system/bin/preinstall.sh;

#install busybox
./adb shell mkdir -p /system/xbin;
./adb push /goodybag/mobile/tapin\ station/static/binaries/busybox /system/xbin/busybox;
./adb shell chmod 755 /system/xbin/busybox;
./adb shell /system/xbin/busybox --install -s /system/xbin;

#install wget
./adb push /goodybag/mobile/tapin\ station/static/binaries/wget /system/xbin/wget;
./adb shell chmod 755 /system/xbin/wget;

#link to bin directory (needed for cron)
./adb shell ln -s /system/bin/ /bin;

#setup cron
./adb shell "echo 'root:x:0:0::/data/cron:/system/bin/bash' > /etc/passwd";
./adb shell mkdir -p /data/cron;
./adb push /goodybag/mobile/tapin\ station/static/crontab-root /data/cron/root;
./adb shell crond -L /data/cron.log -c /data/cron;

#remove write permissions on /system
./adb shell mount -o ro,remount -t yaffs2 /dev/block/nandd /system;


#all in one line (recreate if modifications are made to the above)
./adb wait-for-device; ./adb shell mount -o rw,remount -t yaffs2 /dev/block/nandd /system; ./adb shell mkdir -p /data/gb/scripts; ./adb push /goodybag/mobile/tapin\ station/static/scripts /data/gb/scripts; ./adb push /goodybag/mobile/tapin\ station/static/scripts /data/gb/original/scripts; ./adb push /goodybag/mobile/tapin\ station/static/preinstall.sh /system/bin/preinstall.sh; ./adb shell mkdir -p /system/xbin; ./adb push /goodybag/mobile/tapin\ station/static/binaries/busybox /system/xbin/busybox; ./adb shell chmod 755 /system/xbin/busybox; ./adb shell /system/xbin/busybox --install -s /system/xbin; ./adb push /goodybag/mobile/tapin\ station/static/binaries/wget /system/xbin/wget; ./adb shell chmod 755 /system/xbin/wget; ./adb shell ln -s /system/bin/ /bin; ./adb shell "echo 'root:x:0:0::/data/cron:/system/bin/bash' > /etc/passwd"; ./adb shell mkdir -p /data/cron; ./adb push /goodybag/mobile/tapin\ station/static/crontab-root /data/cron/root; ./adb shell crond -L /data/cron.log -c /data/cron; ./adb shell mount -o ro,remount -t yaffs2 /dev/block/nandd /system;