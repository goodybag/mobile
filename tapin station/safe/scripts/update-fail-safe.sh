#!/bin/sh

alias logi="log -p i -t'GB-FAIL-SAFE'";
alias logw="log -p w -t'GB-FAIL-SAFE'";
alias logd="log -p d -t'GB-FAIL-SAFE'";
alias logv="log -p v -t'GB-FAIL-SAFE'";
alias loge="log -p e -t'GB-FAIL-SAFE'";


t1=`cat /data/gb/UPDATE_TIMESTAMP_1`;
t2=`cat /data/gb/UPDATE_TIMESTAMP_2`;

if [ "$t1" == "$t2" ] || [ ! -e /data/gb/UPDATE_TIMESTAMP_1 ]
then
	#This is a problem - this means the updater is failing (not making it to end of script), restore original
	loge "UPDATER DID NOT RUN! RESTORING SYSTEM!";
	rm -r /data/gb/system
	cp -R /data/safe/original/* /data/gb/system/

	#restarting cron if it's running
	loge "RESTARTING CRON"
	regular_cron=`/system/xbin/busybox ps aux | grep crond\ -c\ \/data\/cron$ | awk '/([0-9]+)\s*([0-9]+)/ {print $1}'`

	if [ "$regular_cron" != "" ]
	then
		kill -9 $regular_cron
	fi

	/system/xbin/crond -c /data/cron

else
	logi "updater is working";
	cp /data/gb/UPDATE_TIMESTAMP_1 /data/gb/UPDATE_TIMESTAMP_2;
fi

#check if cron for the regular goodybag system (we are the fail-safe system) is running, if not start it
regular_cron=`/system/xbin/busybox ps aux | grep crond\ -c\ \/data\/cron$ | awk '/([0-9]+)\s*([0-9]+)/ {print $1}'`
if [ "$regular_cron" == "" ] || [ -z "$regular_cron" ]
then
	logw "regular cron is not running, restarting it"
	/system/xbin/crond -c /data/cron
else
	logi "the regular cron script is running"
fi


#have it brough to the foreground (will automatically ignore if it's already in the foreground)
#we don't want to do this as it tries to capture the camera
#am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity;