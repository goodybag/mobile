#!/system/bin/sh

#path configuration
ln -s /system/bin /bin

#start cron
/system/xbin/crond -c /data/cron

#execute anything else
if [ -e /data/gb/scripts/post-boot.sh ]; then
        sh /data/gb/scripts/post-boot.sh
fi