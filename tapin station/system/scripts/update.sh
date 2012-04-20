#!/system/bin/sh

alias logi="log -p i -t'GB-UPDATE'";
alias logw="log -p w -t'GB-UPDATE'";
alias logd="log -p d -t'GB-UPDATE'";
alias logv="log -p v -t'GB-UPDATE'";
alias loge="log -p e -t'GB-UPDATE'";

url="http://updates.station.goodybag.com";
logi "[GB] checking for updates";
remoteVersion=`/system/xbin/wget -qO- $url/VERSION`;
localVersion=`cat /data/gb/system/VERSION`;

#check for new version
if [ $remoteVersion != $localVersion ] || [ -z $localVersion ]
then
	if [ -e /data/gb/system/scripts/pre-download.sh ]
	then
		logi "running pre-download.sh script";
		/system/bin/sh /data/gb/system/scripts/pre-download.sh;
	else
		logi "no pre-download.sh script";
	fi

	#download zip
	#verify checksum
	#decrypt it
	#extract it
	#run init.sh

	logi "currently running version: $localVersion";
	logi "downloading version: $remoteVersion";

	#download checksum
	remoteChecksum=`/system/xbin/wget -qO- $url/downloads/$remoteVersion/checksum`;

	#download update
	/system/bin/rm -r /data/gb/tmp/update;
	/system/bin/mkdir -p /data/gb/tmp/update;
	/system/xbin/wget $url/downloads/$remoteVersion-update.gbz -q -O /data/gb/tmp/update/update.gbz;

	localChecksum=`md5sum /data/gb/tmp/update.gbz | awk -F"  " "{print $1}"`

	#verify checksum
	if [ $localChecksum == $remoteChecksum ] && [ $localChecksum != "" ] && [ $remoteChecksum != "" ]
	then
		logi "checksum is valid, decrypting"
		#decrypt
		openssl aes-256-cbc -k /data/safe/KEY -a -d -in /data/gb/tmp/update.gbz -out /data/gb/tmp/update.tar.gz;
		decryptSuccess = `echo $?`;
		if [ decryptSuccess = "0" ]
		then
			logi "decryption was successful, updating"
			/system/xbin/gunzip /data/gb/tmp/update.tar.gz;
			/system/xbin/tar -zxf /data/gb/tmp update.tar;
			/system/bin/sh /data/gb/tmp/update/init.sh;
		else
			loge "decryption FAILED"
		fi
	else
		loge "checksum is INVALID, not decrypting"
	fi
else
    logw "already on version - $localVersion";
fi

echo `date` > /data/gb/UPDATE_TIMESTAMP_1;
logi "[GB] done";