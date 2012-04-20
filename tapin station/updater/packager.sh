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
cp -R "$root/system" "$tmpDir/"
cp "$root/updater/init.sh" "$tmpDir/"
cp "$apk" "$tmpDir/"

#package
cd "$tmpDir"
tar -czvf "$package" "."
openssl aes-256-cbc -kfile "$key" -a -salt -in "$package" -out "$download"
openssl md5 "$download" | awk -F'= ' '{print $2}' > "$checksum"

echo "UPLOAD THE VERSION FILE LAST"