#!/system/bin/sh

url="http://station.goodybag.com"
echo "[GB] checking for updates"
remoteVersion=`/system/xbin/wget -qO- $url/static/VERSION`;
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

	echo "currently running version: $localVersion"
	echo "downloading version: $remoteVersion";
	su -c "/system/xbin/wget $url/static/patch.sh -q -O /data/gb/scripts/patch.sh; /system/xbin/wget $url/static/gb.apk -q -O /sdcard/gb.apk;";

	if [ -e /data/gb/scripts/patch.sh ]
	then
		echo "applying patch";
		su -c "/system/bin/sh /data/gb/scripts/patch.sh;"
	else
		echo "no patch.sh script";
	fi

	su -c "/system/bin/sh /data/gb/scripts/post-patch.sh;"
else
    echo "already on version - $localVersion";
fi

echo `date` > /data/gb/UPDATE_TIMESTAMP_1
echo "[GB] done"