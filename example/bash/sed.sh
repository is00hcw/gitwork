#!/bin/bash

SERVER=/etc/nginx/conf.d/app.atsmart.io.conf
BAK=~/nginx/app.atsmart.io.conf
cp -f $SERVER $BAK

echo "enable local server"
sed -i  's/#\(.*server.*#local\)/\1/'  $SERVER  &&  sed -i  's/.*\(server.*#173\)/#\1/'  $SERVER
echo "diff $SERVER $BAK"
diff $SERVER $BAK
sleep 2s

echo "restart nginx"
sudo /etc/init.d/nginx restart