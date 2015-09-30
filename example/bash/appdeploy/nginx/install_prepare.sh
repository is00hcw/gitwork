#!/bin/sh
LIBPATH="/aliyun/server/lib"
mkdir -p $LIBPATH

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
if [ ! -d zlib-1.2.8 ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/nginx/zlib-1.2.8.tar.gz
    tar -zvxf zlib-1.2.8.tar.gz
    cd zlib-1.2.8
    ./configure --prefix=$LIBPATH/zlib-1.2.8
    make
    make install
    ./configure &&  make
    make install

    cd ..
    rm -rf zlib-1.2.8.tar.gz
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

