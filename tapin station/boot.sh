#!/system/bin/sh
ln -s /system/bin /bin
crond -L /data/cron.log -c /data/cron

if [ ! -e /data/gb/scripts/post.sh ]; then
        sh /data/gb/scripts/post.sh
fi