#!/usr/bin/env bash

root="/goodybag/mobile/tapin station"
tmpDir="$root/tmp"
releaseDir="$root/releases"
packageDir="$root/packages"
downloadDir="$root/downloads"

key="$root/safe/KEY"
version=`cat "$root/VERSION"`

apk="$releaseDir/$version.apk"
package="$packageDir/$version.tar.gz"
download="$downloadDir/$version.gbz"
checksum="$downloadDir/$version.md5"

#make sure directories exist
mkdir -p "$packageDir"
mkdir -p "$downloadDir"

#create temporary area
rm -rf "$tmpDir"
mkdir -p "$tmpDir"

#copy files to package
cp -R "$root/system" "$tmp/"
cp "$root/updater/init.sh" "$tmp/"
cp "$apk" "$tmp/"

#package
cd "$tmp"
tar -czvf "$package" "$tmp/*"
openssl aes-256-cbc -k "$key" -a -salt -in "$package" -out "$download"
openssl md5 "$download" | cut -d "=" -f2 > "$checksum"

echo "UPLOAD THE VERSION FILE LAST"