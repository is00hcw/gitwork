frpm=$(cat /proc/version | grep -E "redhat|centos")
ifdpkg=$(cat /proc/version | grep -Ei "ubuntu|debian")
ifgentoo=$(cat /proc/version | grep -i gentoo)
ifsuse=$(cat /proc/version | grep -i suse)

cd /aliyun/server/nginx
rm -rf nginx-1.9.2
if [ ! -f nginx-1.9.2.tar.gz ];then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/nginx/nginx-1.9.2.tar.gz
fi
tar zxvf nginx-1.9.2.tar.gz
cd nginx-1.9.2
./configure --user=www \
--group=www \
--prefix=/aliyun/server/nginx \
--with-pcre=/aliyun/server/lib/pcre-8.37 \
--with-zlib=/aliyun/server/lib/zlib-1.2.8 \
--with-openssl=/aliyun/server/lib/openssl-1.0.2d \
--with-http_stub_status_module \
--without-http-cache \
--with-http_ssl_module \
--with-http_gzip_static_module
CPU_NUM=$(cat /proc/cpuinfo | grep processor | wc -l)
if [ $CPU_NUM -gt 1 ];then
    make -j$CPU_NUM
else
    make
fi
make install

groupadd www
useradd -g www -s /sbin/nologin www
mkdir -p /aliyun/www/phpwind
mkdir -p /aliyun/log/nginx/access
mkdir -p /aliyun/server/nginx/logs
mkdir -p /aliyun/server/nginx/sbin
mkdir -p /aliyun/server/nginx/conf
chmod 775 /aliyun/server/nginx/logs
chmod 775 /aliyun/server/nginx/sbin
chmod 775 /aliyun/server/nginx/conf
chown -R www:www /aliyun/server/nginx/logs
mkdir -p /aliyun/www
chmod -R 775 /aliyun/www
chown -R www:www /aliyun/www

cd /aliyun/server/nginx
cp -fR ./config-nginx-tomcat/* /aliyun/server/nginx/conf/
chmod 755 /aliyun/server/nginx/sbin/nginx
#/aliyun/server/nginx/sbin/nginx
mv /aliyun/server/nginx/sbin/nginx /etc/init.d/

if [ "$ifrpm" != "" ];then
    mv /aliyun/server/nginx/conf/centos_tomcat7 /etc/init.d/tomcat7
fi
if [ "$ifdpkg" != "" ] || [ "$ifgentoo" != "" ];then
    mv /aliyun/server/nginx/conf/ubuntu_tomcat7 /etc/init.d/tomcat7
fi
if [ "$ifsuse" != "" ];then
    mv /aliyun/server/nginx/conf/opensuse_tomcat7 /etc/init.d/tomcat7
fi
chmod +x /etc/init.d/nginx
groupadd -f www
useradd -g www www

/etc/init.d/nginx 
