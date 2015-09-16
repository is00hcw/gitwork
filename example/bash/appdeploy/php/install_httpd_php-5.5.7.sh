#!/bin/bash
rm -rf php-5.5.27
if [ ! -f php-5.5.27.tar.gz ];then
  wget  http://aliyun-dep.oss-cn-beijing.aliyuncs.com/php/php-5.5.27.tar.gz
fi
tar zxvf php-5.5.27.tar.gz
cd php-5.5.27

./configure --prefix=/aliyun/server/php \
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
--enable-maintainer-zts \
--enable-zend-multibyte \
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
--with-apxs2=/aliyun/server/httpd/bin/apxs \
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
#adjust php.ini
groupadd www
useradd -g www -s /sbin/nologin www

mkdir -p /aliyun/www/phpwind
mkdir -p /aliyun/server/httpd/conf/vhosts/
mkdir -p /aliyun/server/httpd/conf/extra/

sed -i "s#LoadModule rewrite_module modules/mod_rewrite.so#LoadModule rewrite_module modules/mod_rewrite.so\nLoadModule php5_module modules/libphp5.so#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#User daemon#User www#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#Group daemon#Group www#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s;#ServerName www.example.com:80;ServerName www.example.com:80;" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#/aliyun/server/httpd/htdocs#/aliyun/www#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#<Directory />#<Directory \"/aliyun/www\">#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#AllowOverride None#AllowOverride all#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s#DirectoryIndex index.html#DirectoryIndex index.html index.htm index.php#" /aliyun/server/httpd/conf/httpd.conf
sed -i "s;#Include conf/extra/httpd-mpm.conf;Include conf/extra/httpd-mpm.conf;" /aliyun/server/httpd/conf/httpd.conf
sed -i "s;#Include conf/extra/httpd-vhosts.conf;Include conf/extra/httpd-vhosts.conf;" /aliyun/server/httpd/conf/httpd.conf

echo "HostnameLookups off" >> /aliyun/server/httpd/conf/httpd.conf
echo "AddType application/x-httpd-php .php" >> /aliyun/server/httpd/conf/httpd.conf

echo "NameVirtualHost *:80" > /aliyun/server/httpd/conf/extra/httpd-vhosts.conf
echo "Include /aliyun/server/httpd/conf/vhosts/*.conf" >> /aliyun/server/httpd/conf/extra/httpd-vhosts.conf

sed -i 's/StartServers          5/StartServers         10/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf
sed -i 's/MinSpareServers       5/MinSpareServers      10/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf
sed -i 's/MaxSpareServers      10/MaxSpareServers      30/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf
sed -i 's/MaxClients          150/MaxClients          255/g' /aliyun/server/httpd/conf/extra/httpd-mpm.conf

cat > /aliyun/server/httpd/conf/vhosts/phpwind.conf << END
<DirectoryMatch "/aliyun/www/phpwind/(attachment|html|data)">
<Files ~ ".php">
Order allow,deny
Deny from all
</Files>
</DirectoryMatch>

<VirtualHost *:80>
        DocumentRoot /aliyun/www/phpwind
        ServerName localhost
        ServerAlias localhost
        <Directory "/aliyun/www/phpwind">
            Options Indexes FollowSymLinks
            AllowOverride all
            Order allow,deny
            Allow from all
        </Directory>
        <IfModule mod_rewrite.c>
                RewriteEngine On
                RewriteRule ^(.*)-htm-(.*)$ $1.php?$2
                RewriteRule ^(.*)/simple/([a-z0-9\_]+\.html)$ $1/simple/index.php?$2
        </IfModule>
        ErrorLog "/aliyun/log/httpd/phpwind-error.log"
        CustomLog "/aliyun/log/httpd/phpwind.log" common
</VirtualHost>
END

nohup /etc/init.d/httpd restart
sleep 5


