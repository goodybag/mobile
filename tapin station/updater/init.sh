#!/system/bin/sh

pm install -r 1.0.2.apk
am start -a android.intent.action.MAIN -n com.google.zxing.client.android/com.goodybag.tapin.station.activities.SettingActivity;