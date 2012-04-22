#!/usr/bin/env bash

adb wait-for-device;

echo "reset structure"
adb shell rm -r /data/safe;
adb shell mkdir -p /data/safe;
adb shell rm -r /data/gb;
adb shell mkdir -p /data/gb;

#this is the structure for openssl
adb shell mkdir -p /data/local/bin;
adb shell mkdir -p /data/local/lib;
adb shell mkdir -p /data/local/etc;
adb shell mkdir -p /data/local/tmp;

adb shell chmod -R 755 /data/local/bin;
adb shell chmod -R 755 /data/local/lib;
adb shell chmod -R 755 /data/local/etc;
adb shell chmod -R 777 /data/local/tmp;

echo "Install busybox, setup gb data directory, setup cron"

echo "make /system writable"
adb shell mount -o rw,remount -t yaffs2 /dev/block/nandd /system;

echo "setup gb system"
adb shell mkdir -p /data/gb/tmp;
adb shell mkdir -p /data/gb/system;
adb shell mkdir -p /data/safe/original/system;

adb push /goodybag/mobile/tapin\ station/system /data/gb/system;
adb push /goodybag/mobile/tapin\ station/safe /data/safe;
adb push /goodybag/mobile/tapin\ station/system /data/safe/original/system;

echo "create /sqlite_stmt_journals for bash to create temporary files (also in preinstall.sh, because it is lost after reboot)"
adb shell mkdir -p /sqlite_stmt_journals;

echo "install busybox" #this is hacky because come tablets don't even have cp!
adb shell mkdir -p /system/xbin;
adb shell touch busybox;
adb shell "cat /data/gb/system/binaries/busybox > busybox";
adb shell chmod 755 busybox;
adb shell busybox --install -s /system/xbin;

echo "integrate into boot (modify existing preinstall.sh script - hack)"
adb shell rm /system/bin/preinstall.sh;
adb shell busybox ln -s -f /data/safe/scripts/preinstall.sh /system/bin/preinstall.sh;

echo "install wget"
adb shell busybox cp -f /data/gb/system/binaries/wget /system/xbin/wget;
adb shell chmod 755 /system/xbin/wget;

echo "install openssl"
adb shell busybox cp -R -f /data/gb/system/libs/openssl/* /data/local/lib/;
adb shell busybox cp -f /data/gb/system/binaries/linker /data/local/bin/linker;
adb shell busybox cp -f /data/gb/system/binaries/openssl /data/local/bin/openssl;
adb shell busybox cp -f /data/gb/system/binaries/openssl /system/xbin/openssl;
adb shell chmod 755 /data/local/bin/linker;
adb shell chmod 755 /data/local/bin/openssl;
adb shell chmod 755 /system/xbin/openssl;

echo "link to bin directory (needed for cron)"
adb shell busybox ln -s -f /system/bin/ /bin;

echo "setup cron"
adb shell "echo 'root:x:0:0::/data/cron:/system/bin/sh' > /etc/passwd";
adb shell rm -r /data/cron;
adb shell mkdir -p /data/cron;
adb shell busybox ln -s -f /data/gb/system/cron/root /data/cron/root;
adb shell crond -c /data/cron;

echo "setup cron fail-safe"
adb shell rm -r /data/cron-safe;
adb shell mkdir -p /data/cron-safe;
adb shell busybox ln -s -f /data/safe/cron/root /data/cron-safe/root;
adb shell crond -c /data/cron-safe;


echo "remove write permissions on /system"
adb shell mount -o ro,remount -t yaffs2 /dev/block/nandd /system;