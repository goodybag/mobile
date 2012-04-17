#!/bin/sh

echo "[GB] checking for updates"
remoteVersion=`/system/xbin/wget -qO- https://station.goodybag.com/static/VERSION`;
localVersion=`cat /data/gb/VERSION`;
if [ $remoteVersion != $localVersion ] || [ -z $localVersion ]
then
	echo "downloading version $remoteVersion";
	su -c "/system/bin/sh /data/gb/scripts/pre-download.sh; /system/xbin/wget https://station.goodybag.com/static/gb.apk -q -O /sdcard/gb.apk";
    echo "installing version $remoteVersion";
    su -c "/system/bin/sh /data/gb/scripts/pre-update.sh; pm install -r /sdcard/gb.apk; mv /sdcard/gb.apk /sdcard/gb.apk.old; am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity; echo '$remoteVersion'> /data/gb/VERSION; /system/bin/sh /data/gb/scripts/post-update.sh";
else
    echo "already on version - $localVersion";
fi