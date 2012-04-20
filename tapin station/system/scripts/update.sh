#!/system/bin/sh

alias logi="log -p i -t'GB-UPDATE'";
alias logw="log -p w -t'GB-UPDATE'";
alias logd="log -p d -t'GB-UPDATE'";
alias logv="log -p v -t'GB-UPDATE'";
alias loge="log -p e -t'GB-UPDATE'";

baseUrl="http://updates.station.goodybag.com";
downloadUrl="$baseUrl/downloads";
logi "[GB] checking for updates";
remoteVersion=`/system/xbin/wget -qO- $baseUrl/VERSION`;
localVersion=`cat /data/gb/VERSION`;

#check for new version

if [ "$remoteVersion" != "$localVersion" ] || [ -z "$localVersion" ] && [ "$remoteVersion" != "" ]
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
	remoteChecksum=`/system/xbin/wget -qO- $downloadUrl/$remoteVersion.md5`;

	#download update
	/system/bin/rm -r /data/gb/tmp/update;
	/system/bin/mkdir -p /data/gb/tmp/update;
	/system/xbin/wget $downloadUrl/$remoteVersion.gbz -q -O /data/gb/tmp/update/update.gbz;

	localChecksum=`openssl md5 /data/gb/tmp/update/update.gbz | awk -F'= ' '{print $2}'`

	#verify checksum
	if [ $localChecksum == $remoteChecksum ] && [ $localChecksum != "" ] && [ $remoteChecksum != "" ]
	then
		logi "checksum is valid, decrypting"
		#decrypt
		openssl aes-256-cbc -kfile /data/safe/KEY -a -d -in /data/gb/tmp/update/update.gbz -out /data/gb/tmp/update/update.tar.gz;
		decryptSuccess=`echo $?`;
		if [ $decryptSuccess == "0" ]
		then
			logi "decryption was successful, updating"
			/system/xbin/gunzip /data/gb/tmp/update/update.tar.gz;
			mkdir -p /data/gb/tmp/update/package
			cd /data/gb/tmp/update/package
			/system/xbin/tar -xvf /data/gb/tmp/update/update.tar;
			/system/bin/sh init.sh;
		else
			loge "decryption FAILED"
		fi
	else
		loge "checksum is INVALID (l: $localChecksum r: $remoteChecksum), not decrypting"
	fi
else
    logw "already on version - $localVersion";
fi

echo `date` > /data/gb/UPDATE_TIMESTAMP_1;
logi "[GB] done";