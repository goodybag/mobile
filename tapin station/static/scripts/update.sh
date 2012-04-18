#!/bin/sh

echo "[GB] checking for updates"
remoteVersion=`/system/xbin/wget -qO- http://station.goodybag.com/static/VERSION`;
localVersion=`cat /data/gb/VERSION`;

if [ $remoteVersion != $localVersion ] || [ -z $localVersion ]
then
	if [ -e /data/gb/scripts/pre-download.sh ]
	then
		echo "running pre-download.sh script";
		su -c "/system/bin/sh /data/gb/scripts/pre-download.sh;";
	else
		echo "no pre-download.sh script";
	fi

	echo "downloading version $remoteVersion";
	su -c "/system/xbin/wget http://station.goodybag.com/static/patches.sh -q -O /data/gb/scripts/patches.sh; /system/xbin/wget http://station.goodybag.com/static/gb.apk -q -O /sdcard/gb.apk;";

	if [ -e /data/gb/scripts/patches.sh ]
	then
		echo "applying any patches";
		su -c "/system/bin/sh /data/gb/scripts/patches.sh;"
	else
		echo "no patches.sh script";
	fi

    if [ -e /data/gb/scripts/pre-upgrade.sh ]
	then
		echo "running pre-upgrade.sh script";
		su -c "/system/bin/sh /data/gb/scripts/pre-upgrade.sh";
	else
		echo "no pre-upgrade.sh script";
	fi

    echo "upgrading/installing version $remoteVersion";
    su -c "pm install -r /sdcard/gb.apk; mv /sdcard/gb.apk /sdcard/gb.apk.old; am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity;";

	if [ -e /data/gb/scripts/post-upgrade.sh ]
	then
		echo "running post-upgrade.sh script";
		su -c "/system/bin/sh /data/gb/scripts/post-upgrade.sh";
	else
		echo "no post-upgrade.sh script";
	fi

	echo "cleaning up";
    su -c "rm /data/gb/scripts/patches.sh; rm /data/gb/scripts/pre-download.sh; rm /data/gb/scripts/pre-upgrade.sh; rm /data/gb/scripts/post-upgrade.sh;"
else
    echo "already on version - $localVersion";
fi

echo `date` > /data/gb/CRON_1
echo "[GB] done"