#!/bin/sh
if [ `uname -m` == "x86_64" ];then
  machine=x86_64
else
  machine=i686
fi

if [ $machine == "x86_64" ]; then
  if [ ! -f jdk-7u79-linux-x64.gz ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/java/jdk-7u79-linux-x64.gz
  fi

  tar zxvf jdk-7u79-linux-x64.gz
  mv jdk1.7.0_79/*  /aliyun/server/java
else
  if [ ! -f jdk-7u79-linux-i586.gz ];then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/java/jdk-7u79-linux-i586.gz
  fi
  tar zxvf jdk-7u79-linux-i586.gz
  mv jdk1.7.0_79/*  /aliyun/server/java
fi

chmod +x /aliyun/server/java/jre/bin/java
chmod +x /aliyun/server/java/bin/java

echo 'export JAVA_HOME=/aliyun/server/java' >> /etc/profile
echo 'export JRE_HOME=/aliyun/server/java/jre' >> /etc/profile
echo 'export CLASSPATH=/aliyun/server/java/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib:$JRE_HOME/lib:.:$CLASSPATH' >> /etc/profile
echo 'export PATH=/aliyun/server/mysql/bin:/aliyun/server/nginx/sbin:$JAVA_HOME/bin:$PATH' >> /etc/profile
source /etc/profile

java -version
