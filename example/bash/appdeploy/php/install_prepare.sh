#!/bin/sh
cd ~/
if [ ! -f zlib-1.2.8.tar.gz ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/nginx/zlib-1.2.8.tar.gz
fi
 tar -zvxf zlib-1.2.8.tar.gz
 cd zlib-1.2.8
 ./configure
 make
 make install
cd ~/
rm -rf zlib-1.2.8*

if [ ! -f libpng-1.6.18.tar.gz ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/libpng-1.6.18.tar.gz
fi  
tar -zvxf libpng-1.6.18.tar.gz
cd libpng-1.6.18
./configure 
make
make install
cd ..
rm -rf libpng-1.6.18*


LIBPATH="/aliyun/server/lib"
mkdir -p $LIBPATH
cd $LIBPATH

if [ ! -d mhash-0.9.9.9 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/mhash-0.9.9.9.tar.gz
    tar -zvxf mhash-0.9.9.9.tar.gz
    cd mhash-0.9.9.9
    ./configure --prefix=$LIBPATH/mhash-0.9.9.9
    make
    make install
    cd ..
    rm -rf mhash-0.9.9.9.tar.gz
fi

cd $LIBPATH
if [ ! -d zlib-1.2.8 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/nginx/zlib-1.2.8.tar.gz
    tar -zvxf zlib-1.2.8.tar.gz
    cd zlib-1.2.8
    ./configure --prefix=$LIBPATH/zlib-1.2.8
    make
    make install
    cd ..
    rm -rf zlib-1.2.8.tar.gz
fi

cd $LIBPATH
if [ ! -d libpng-1.6.18 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/libpng-1.6.18.tar.gz
    tar -zvxf libpng-1.6.18.tar.gz
    cd libpng-1.6.18
    ./configure --prefix=$LIBPATH/libpng-1.6.18
    make
    make install
    cd ..
    rm -rf libpng-1.6.18.tar.gz
fi


cd $LIBPATH
if [ ! -d libxml2-2.7.6 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/libxml2-2.7.6.tar.gz
    tar -zvxf libxml2-2.7.6.tar.gz
    cd libxml2-2.7.6
    ./configure --prefix=$LIBPATH/libxml2-2.7.6
    make 
    make install
    cd ..
    rm -rf libxml2-2.7.6.tar.gz
fi

cd $LIBPATH
if [ ! -d libmcrypt-2.5.8 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/libmcrypt-2.5.8.tar.gz
    tar -zvxf libmcrypt-2.5.8.tar.gz
    cd libmcrypt-2.5.8
    ./configure --prefix=$LIBPATH/libmcrypt-2.5.8
    make
    make install
    cd ..
    rm -rf libmcrypt-2.5.8.tar.gz
fi

cd $LIBPATH
if [ ! -d openssl-1.0.2d ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/openssl-1.0.2d.tar.gz
    tar -zvxf openssl-1.0.2d.tar.gz
    cd openssl-1.0.2d
    ./configure --prefix=$LIBPATH/openssl-1.0.2d
    make
    make install
    cd ..
    rm -rf openssl-1.0.2d.tar.gz
fi

cd $LIBPATH
if [ ! -d libmemcached-1.0.18 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/libmemcached-1.0.18.tar.gz
    tar -zvxf libmemcached-1.0.18.tar.gz
    cd libmemcached-1.0.18
    ./configure --prefix=$LIBPATH/libmemcached-1.0.18
    make
    make install
    cd ..
    rm -rf libmemcached-1.0.18.tar.gz
fi


cd $LIBPATH
if [ ! -d curl-7.44.0 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/curl-7.44.0.tar.gz
    tar -zvxf curl-7.44.0.tar.gz
    cd curl-7.44.0
    ./configure --prefix=$LIBPATH/curl-7.44.0
    make
    make install
    chmod 755 $LIBPATH/curl-7.44.0/curl-config
    cd ..
    rm -rf curl-7.44.0.tar.gz
fi

cd $LIBPATH
if [ ! -d pcre-8.37 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/nginx/pcre-8.37.tar.gz
    tar -zvxf pcre-8.37.tar.gz
    cd pcre-8.37
    ./configure --prefix=$LIBPATH/pcre-8.37
    make
    make install
    cd ..
    rm -rf pcre-8.37.tar.gz
fi


