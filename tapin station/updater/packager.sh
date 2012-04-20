#!/usr/bin/env bash

root="/goodybag/mobile/tapin\ station"
releasesDir="$root/releases"
packageDir="$root/packages"
downloadDir="$root/downloads"

key="$root/safe/KEY"
version="$root/VERSION"

apk="$releaseDir/$version.apk"
package="$packageDir/$version.tar.gz"
download="$downloadDir/$version.gbz"

mkdir -p $packageDir
mkdir -p $downloadDir

tar -czvf $package $root/system/ $root/updater/init.sh $apk
openssl aes-256-cbc -k $key -a -salt -in $package -out $update

checksum= `openssl md5 $update | cut -d "=" -f2`