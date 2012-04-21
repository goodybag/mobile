#!/system/bin/busybox sh

#this replaces /system/bin/preinstall.sh

echo "do preinstall job"
BUSYBOX="/system/bin/busybox"

#this is for openssl
export PATH=$PATH:/data/local/bin

#GB enable temporary files in shell script
mkdir -p /sqlite_stmt_journals

#GB cron fail-safe
/system/xbin/crond -c /data/cron-safe

#GB boot
/system/bin/sh /data/gb/system/scripts/boot.sh

if [ ! -e /data/system.notfirstrun ]; then
        /system/bin/sh /system/bin/pm preinstall /system/preinstall

        # copy android modify tool files
        mkdir /mnt/nanda
        mount -t vfat /dev/block/nanda /mnt/nanda
#       $BUSYBOX cp /mnt/nanda/vendor/initlogo.rle /
        $BUSYBOX cp /mnt/nanda/vendor/system/build.prop /system/
        $BUSYBOX cp /mnt/nanda/vendor/system/media/bootanimation.zip /system/media/
        $BUSYBOX cp /mnt/nanda/vendor/system/usr/keylayout/*.kl /system/usr/keylayout/
        sync
        umount /mnt/nanda
        rmdir /mnt/nanda

        $BUSYBOX touch /data/system.notfirstrun

fi

echo "preinstall ok"