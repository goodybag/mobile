#!/system/bin/sh

#we should be put into this directory, but just incase
cd /data/gb/tmp/update/package

#replace system
rm -r /data/gb/system
cp -R system /data/gb/

#install and start app
pm install -r 1.0.5.apk
am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity;