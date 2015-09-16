#!/bin/bash

ifubuntu=$(cat /proc/version | grep ubuntu)
if14=$(cat /etc/issue | grep 14)

if [ `uname -m` == "x86_64" ];then
machine=x86_64
else
machine=i686
fi
if [ $machine == "x86_64" ];then
  rm -rf mysql-5.5.45-linux2.6-x86_64
  if [ ! -f mysql-5.5.45-linux2.6-x86_64.tar.gz ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/mysql/mysql-5.5.45-linux2.6-x86_64.tar.gz
  fi
  tar -xzvf mysql-5.5.45-linux2.6-x86_64.tar.gz
  mv mysql-5.5.45-linux2.6-x86_64/* /aliyun/server/mysql
else
  rm -rf mysql-5.5.45-linux2.6-i686
  if [ ! -f mysql-5.5.45-linux2.6-i686.tar.gz ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/mysql/mysql-5.5.45-linux2.6-i686.tar.gz
  fi
  tar -xzvf mysql-5.5.45-linux2.6-i686.tar.gz
  mv mysql-5.5.45-linux2.6-i686/* /aliyun/server/mysql
fi

if [ "$ifubuntu" != "" ] && [ "$if14" != "" ];then
	mv /etc/mysql/my.cnf /etc/mysql/my.cnf.bak
fi

groupadd mysql
useradd -g mysql -s /sbin/nologin mysql
/aliyun/server/mysql/scripts/mysql_install_db --datadir=/aliyun/server/mysql/data/ --basedir=/aliyun/server/mysql --user=mysql
chown -R mysql:mysql /aliyun/server/mysql/
chown -R mysql:mysql /aliyun/server/mysql/data/
chown -R mysql:mysql /aliyun/log/mysql
\cp -f /aliyun/server/mysql/support-files/mysql.server /etc/init.d/mysqld
sed -i 's#^basedir=$#basedir=/aliyun/server/mysql#' /etc/init.d/mysqld
sed -i 's#^datadir=$#datadir=/aliyun/server/mysql/data#' /etc/init.d/mysqld
\cp -f /aliyun/server/mysql/support-files/my-medium.cnf /etc/my.cnf
echo "expire_logs_days = 5" >> /etc/my.cnf
echo "max_binlog_size = 1000M" >> /etc/my.cnf
sed -i 's#skip-external-locking#skip-external-locking\nlog-error=/aliyun/log/mysql/error.log#' /etc/my.cnf
cp /aliyun/server/mysql/bin/mysql /usr/local/bin/
mkdir -p /aliyun/log/mysql
chmod 755 /etc/init.d/mysqld
/etc/init.d/mysqld start
