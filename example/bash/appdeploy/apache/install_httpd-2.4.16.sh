#!/bin/bash
rm -rf httpd-2.4.16 apr-1.5.2 apr-util-1.5.4
if [ ! -f httpd-2.4.16.tar.gz ];then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/apache/httpd-2.4.16.tar.gz
fi
tar zxvf httpd-2.4.16.tar.gz

if [ ! -f apr-1.5.2.tar.gz ];then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/apr-1.5.2.tar.gz
fi
tar -zxvf apr-1.5.2.tar.gz
cp -rf apr-1.5.2 httpd-2.4.16/srclib/apr

if [ ! -f apr-util-1.5.4.tar.gz ];then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/apr-util-1.5.4.tar.gz
fi
tar -zxvf apr-util-1.5.4.tar.gz
cp -rf apr-util-1.5.4 httpd-2.4.16/srclib/apr-util

if [ ! -d /usr/local/ssl ]; then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/openssl-1.0.2d.tar.gz
    tar zvxf openssl-1.0.2d.tar.gz
    cd openssl-1.0.2d
    ./config --prefix=/usr/local && make && make install
fi

mkdir -p /aliyun/log/httpd

cd httpd-2.4.16
./configure --prefix=/aliyun/server/httpd \
--with-mpm=prefork \
--enable-so \
--enable-rewrite \
--enable-nonportable-atomics=yes \
--disable-dav \
--enable-deflate \
--enable-cache \
--enable-disk-cache \
--enable-mem-cache \
--enable-file-cache \
--enable-ssl \
--with-ssl=/usr/local/ssl \
--with-included-apr \
--enable-modules=all  \
--enable-mods-shared=all

CPU_NUM=$(cat /proc/cpuinfo | grep processor | wc -l)
if [ $CPU_NUM -gt 1 ];then
    make -j$CPU_NUM
else
    make
fi
make install
cp support/apachectl /etc/init.d/httpd
chmod u+x /etc/init.d/httpd
cd ..

mkdir -p /aliyun/server/httpd/conf/vhosts/
cp /aliyun/server/httpd/conf/httpd.conf /aliyun/server/httpd/conf/httpd.conf.bak

sed -i "s;#LoadModule rewrite_module modules/mod_rewrite.so;LoadModule rewrite_module modules/mod_rewrite.so;" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#User daemon#User www#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#Group daemon#Group www#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s;#ServerName www.example.com:80;ServerName www.example.com:80;" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#/aliyun/server/httpd/htdocs#/aliyun/www#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#<Directory />#<Directory \"/aliyun/www\">#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#AllowOverride None#AllowOverride all#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#DirectoryIndex index.html#DirectoryIndex index.html index.htm#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s;#Include conf/extra/httpd-mpm.conf;Include conf/extra/httpd-mpm.conf;" /aliyun/server/httpd/conf/httpd.conf
sed -i "s;#Include conf/extra/httpd-vhosts.conf;Include conf/extra/httpd-vhosts.conf;" /aliyun/server/httpd/conf/httpd.conf

echo "HostnameLookups off" >> /aliyun/server/httpd/conf/httpd.conf
echo "AddType application/x-httpd-php .php" >> /aliyun/server/httpd/conf/httpd.conf

echo "Include /aliyun/server/httpd/conf/vhosts/*.conf" > /aliyun/server/httpd/conf/extra/httpd-vhosts.conf


mkdir -p /aliyun/server/httpd/conf/vhosts/

#adjust httpd-mpm.conf
sed -i 's/StartServers             5/StartServers            10/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf
sed -i 's/MinSpareServers          5/MinSpareServers         10/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf
sed -i 's/MaxSpareServers         10/MaxSpareServers         30/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf
sed -i 's/MaxRequestWorkers      150/MaxRequestWorkers      255/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf

nohup /etc/init.d/httpd start
