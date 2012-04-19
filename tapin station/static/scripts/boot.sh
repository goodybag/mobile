#!/system/bin/sh

#path configuration
ln -s /system/bin /bin

#start cron
crond -L /data/cron.log -c /data/cron

#enable temporary files in shell script
mkdir /sqlite_stmt_journals

#execute anything else
if [ -e /data/gb/scripts/post-boot.sh ]; then
        sh /data/gb/scripts/post-boot.sh
fi