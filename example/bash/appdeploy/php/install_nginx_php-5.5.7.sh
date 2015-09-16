#!/bin/bash

if [ `uname -m` == "x86_64" ];then
machine=x86_64
else
machine=i686
fi

rm -rf php-5.5.27
if [ ! -f php-5.5.27.tar.gz ];then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/php/php-5.5.27.tar.gz
fi
tar zxvf php-5.5.27.tar.gz
cd php-5.5.27
./configure --prefix=/aliyun/server/php \
--enable-fpm \
--enable-fastcgi \
--enable-bcmath \
--enable-gd-native-ttf \
--enable-mbstring  \
--enable-shmop \
--enable-soap \
--enable-sockets \
--enable-exif \
--enable-ftp \
--enable-sysvsem \
--enable-pcntl \
--enable-wddx \
--enable-zip \
--enable-xml \
--enable-pdo \
--with-gd \
--with-pear \
--with-curlwrappers \
--with-pcre-regex=/aliyun/server/lib/pcre-8.37 \
--with-libxml-dir=/aliyun/server/lib/libxml2-2.7.6 \
--with-png-dir=/aliyun/server/lib/libpng-1.6.18 \
--with-config-file-path=/aliyun/server/php/etc \
--with-mcrypt=/aliyun/server/lib/libmcrypt-2.5.8 \
--with-zlib=/aliyun/server/lib/zlib-1.2.8 \
--with-curl=/aliyun/server/lib/curl-7.44.0 \
--with-mysql=/aliyun/server/mysql \
--with-mysqli=/aliyun/server/mysql/bin/mysql_config \
--with-pdo-mysql=mysqlnd \
--with-mhash=/aliyun/server/lib/mhash-0.9.9.9

CPU_NUM=$(cat /proc/cpuinfo | grep processor | wc -l)
if [ $CPU_NUM -gt 1 ];then
    make ZEND_EXTRA_LIBS='-liconv' -j$CPU_NUM
else
    make ZEND_EXTRA_LIBS='-liconv'
fi
make install
cd ..
cp ./php-5.5.27/php.ini-production /aliyun/server/php/etc/php.ini
mkdir -p /aliyun/log/php
#adjust php.ini
sed -i 's#; extension_dir = \"\.\/\"#extension_dir = "/aliyun/server/php/lib/php/extensions/no-debug-non-zts-20121212/"#'  /aliyun/server/php/etc/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 64M/g' /aliyun/server/php/etc/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /aliyun/server/php/etc/php.ini
sed -i 's/;date.timezone =/date.timezone = PRC/g' /aliyun/server/php/etc/php.ini
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=1/g' /aliyun/server/php/etc/php.ini
sed -i 's/max_execution_time = 30/max_execution_time = 300/g' /aliyun/server/php/etc/php.ini
#adjust php-fpm
cp /aliyun/server/php/etc/php-fpm.conf.default /aliyun/server/php/etc/php-fpm.conf
sed -i 's,user = nobody,user=www,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,group = nobody,group=www,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,^pm.min_spare_servers = 1,pm.min_spare_servers = 5,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,^pm.max_spare_servers = 3,pm.max_spare_servers = 35,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,^pm.max_children = 5,pm.max_children = 100,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,^pm.start_servers = 2,pm.start_servers = 20,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,;pid = run/php-fpm.pid,pid = run/php-fpm.pid,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,;error_log = log/php-fpm.log,error_log = /aliyun/log/php/php-fpm.log,g'   /aliyun/server/php/etc/php-fpm.conf
sed -i 's,;slowlog = log/$pool.log.slow,slowlog = /aliyun/log/php/\$pool.log.slow,g'   /aliyun/server/php/etc/php-fpm.conf
#self start
install -v -m755 ./php-5.5.27/sapi/fpm/init.d.php-fpm  /etc/init.d/php-fpm
/etc/init.d/php-fpm start
/etc/init.d/nginx -s reload
sleep 5

