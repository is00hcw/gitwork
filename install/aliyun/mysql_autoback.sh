#!/bin/bash

#-----------------------------------------------#

#This is a  free GNU GPL version 3.0 or abover

#Copyright (C) 2008 06 05

#mysql_backup Dedicated copyright by My

#-----------------------------------------------#

echo -e [`date +"%Y-%m-%d %H:%M:%S"`] start

#system time

time=`date +"%y-%m-%d"`

#host IP

host="127.0.0.1"

#database backup user

user="root"

#database password

passwd="yourpasswd"

#Create a backup directory

mkdir -p /backup/db/"$time"

#list database name

all_database=`/usr/bin/mysql -u$user -p$passwd -Bse 'show databases'`

#in the table from the database backup

for i in $all_database

do

/usr/bin/mysqldump -u$user -p$passwd $i > /backup/db/"$time"/"$i"_"$time".sql

done

echo -e [`date +"%Y-%m-%d %H:%M:%S"`]  end

exit 0

# 脚本中的数据库名和数据库密码以用户想备份的库的信息为准，需要用户修改下。
# 运行 crontab -e  写入以下内容
# 30 5 * * * root sh /root/autobackup.sh >/dev/null 2>&1