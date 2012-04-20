#!/system/bin/sh

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
su -c "rm /data/gb/scripts/patch.sh; rm /data/gb/scripts/pre-upgrade.sh; rm /data/gb/scripts/post-upgrade.sh;"