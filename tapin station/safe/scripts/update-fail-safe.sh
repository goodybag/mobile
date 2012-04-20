#!/bin/sh

alias logi="log -p i -t'GB-FAIL-SAFE'";
alias logw="log -p w -t'GB-FAIL-SAFE'";
alias logd="log -p d -t'GB-FAIL-SAFE'";
alias logv="log -p v -t'GB-FAIL-SAFE'";
alias loge="log -p e -t'GB-FAIL-SAFE'";


t1=`cat /data/gb/UPDATE_TIMESTAMP_1`;
t2=`cat /data/gb/UPDATE_TIMESTAMP_2`;

if [ $t1=$t2 ]
then
	#This is a problem - this means the updater is failing (not making it to end of script), restore original
	loge "UPDATER DID NOT RUN! RESTORING SYSTEM!";
	rm -r /data/gb/system
	cp -R /data/gb/original /data/gb/system
else
	logi "updater is working";
	cp /data/gb/UPDATE_TIMESTAMP_1 /data/gb/UPDATE_TIMESTAMP_2;
fi