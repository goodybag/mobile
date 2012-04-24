#!/system/bin/sh

alias logi="log -p i -t'GB-UPDATE'";
alias logw="log -p w -t'GB-UPDATE'";
alias logd="log -p d -t'GB-UPDATE'";
alias logv="log -p v -t'GB-UPDATE'";
alias loge="log -p e -t'GB-UPDATE'";


baseUrl="http://station-updater.goodybag.com";
downloadUrl="$baseUrl/downloads";
notifyUrl="http://biz.goodybag.com/api/clients/registers/update"

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

	businessId=`cat /data/data/com.google.zxing.client.android/files/BID`;
	locationId=`cat /data/data/com.google.zxing.client.android/files/LID`;
	registerId=`cat /data/data/com.google.zxing.client.android/files/RID`;

	#notify system of request
	logi "notifying goodybag of update request"
	/system/xbin/wget --post-data "{businessId: '$businessId', locationId: '$locationId', registerId: '$registerId', localVersion: '$localVersion', remoteVersion: '$remoteVersion'}" $notifyUrl;

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

#check if cron for the fail-safe goodybag system (we are the regular system) is running, if not start it
fail_safe_cron=`/system/xbin/busybox ps aux | grep crond\ -c\ \/data\/cron-safe$ | awk '/([0-9]+)\s*([0-9]+)/ {print $1}'`
if [ "$fail_safe_cron" == "" ] || [ -z "$fail_safe_cron" ]
then
	logw "fail-safe cron is not running, restarting it"
	/system/xbin/crond -c /data/cron-safe
else
	logi "the fail-safe cron script is still running"
fi


logi "[GB] done";