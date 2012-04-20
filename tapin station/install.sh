#!/usr/bin/env bash

adb wait-for-device;

echo "reset structure"
adb shell rm -r /data/safe;
adb shell mkdir -p /data/safe;
adb shell rm -r /data/gb;
adb shell mkdir -p /data/gb;

echo "Install busybox, setup gb data directory, setup cron"

echo "make /system writable"
adb shell mount -o rw,remount -t yaffs2 /dev/block/nandd /system;

echo "setup gb system"
adb shell mkdir -p /data/gb/tmp;
adb shell mkdir -p /data/gb/system;
adb shell mkdir -p /data/gb/original/system;
adb push /goodybag/mobile/tapin\ station/system /data/gb/system;
adb push /goodybag/mobile/tapin\ station/safe /data/safe;

echo "create /sqlite_stmt_journals for bash to create temporary files (also in preinstall.sh, because it is lost after reboot)"
adb shell mkdir -p /sqlite_stmt_journals;

echo "install busybox"
adb shell mkdir -p /system/xbin;
adb shell cp -f /data/gb/system/binaries/busybox /system/xbin/busybox;
adb shell chmod 755 /system/xbin/busybox;
adb shell /system/xbin/busybox --install -s /system/xbin;

echo "integrate into boot (modify existing preinstall.sh script - hack)"
adb shell rm /system/bin/preinstall.sh;
adb shell /system/xbin/busybox ln -s -f /data/safe/scripts/preinstall.sh /system/bin/preinstall.sh;

echo "install wget"
adb shell /system/xbin/busybox cp -f /data/gb/system/binaries/wget /system/xbin/wget;
adb shell chmod 755 /system/xbin/wget;

echo "link to bin directory (needed for cron)"
adb shell /system/xbin/busybox ln -s -f /system/bin/ /bin;

echo "setup cron"
adb shell "echo 'root:x:0:0::/data/cron:/system/bin/sh' > /etc/passwd";
adb shell rm -r /data/cron;
adb shell mkdir -p /data/cron;
adb shell /system/xbin/busybox ln -s -f /data/gb/system/cron/root /data/cron/root;
adb shell crond -c /data/cron;

# echo "setup cron fail-safe"
# adb shell rm -r /data/cron-safe;
# adb shell mkdir -p /data/cron-safe;
# adb shell /system/xbin/busybox ln -s -f /data/safe/cron/root /data/cron-safe/root;
# adb shell crond -c /data/cron-safe;


echo "remove write permissions on /system"
adb shell mount -o ro,remount -t yaffs2 /dev/block/nandd /system;