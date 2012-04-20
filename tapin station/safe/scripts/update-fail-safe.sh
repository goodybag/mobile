#!/bin/sh

t1=`cat /data/gb/UPDATE_TIMESTAMP_1`;
t2=`cat /data/gb/UPDATE_TIMESTAMP_2`;

if [ $t1=$t2 ]
then
	#This is a problem - this means the updater is failing (not making it to end of script), restore original
	rm -r /data/gb/system
	cp -R /data/gb/original /data/gb/system
else
	cp /data/gb/UPDATE_TIMESTAMP_1 /data/gb/UPDATE_TIMESTAMP_2;
fi