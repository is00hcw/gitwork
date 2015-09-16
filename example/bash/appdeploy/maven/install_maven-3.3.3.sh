#!/bin/sh

if [ `uname -m` == "x86_64" ];then
  machine=x86_64
else
  machine=i686
fi

maven_out=`mvn -version | grep "Apache Maven"`
if [ "$maven_out" != "" ]; then
  exit
fi

java_version=`java -version 2>&1  | grep "java version \"1.7"`
if [ "$java_version" == "" ]; then

  mkdir -p /usr/local/java
  if [ $machine == "x86_64" ]; then
    if [ ! -f jdk-7u79-linux-x64.gz ];then
      wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/java/jdk-7u79-linux-x64.gz
    fi

    tar zxvf jdk-7u79-linux-x64.gz
    mv jdk1.7.0_79/*  /usr/local/java
  else
    if [ ! -f jdk-7u79-linux-i586.gz ];then
      wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/java/jdk-7u79-linux-i586.gz
    fi
    tar zxvf jdk-7u79-linux-i586.gz
    cp -rf jdk1.7.0_79/*  /usr/local/java
  fi
  sed -i "/export JAVA_HOME=\/usr\/local\/java/d" /etc/profile
  sed -i "/export JRE_HOME=\/usr\/local\/java\/jre/d" /etc/profile
  sed -i "/export PATH=\/usr\/local\/java\/bin*/d" /etc/profile

  echo 'export JAVA_HOME=/usr/local/java' >> /etc/profile
  echo 'export JRE_HOME=/usr/local/java/jre' >> /etc/profile
  echo 'export PATH=/usr/local/java/bin:$PATH' >> /etc/profile
  source /etc/profile
fi

    
if [ ! -f apache-maven-3.3.3-bin.tar.gz ]; then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/apache-maven-3.3.3-bin.tar.gz
fi

tar zvxf apache-maven-3.3.3-bin.tar.gz
rm -rf /usr/local/apache-maven-3.3.3
mv apache-maven-3.3.3 /usr/local/

sed -i "/MAVEN_HOME=\/usr\/local\/apache-maven-3.3.3/d" /etc/profile;
sed -i "/export MAVEN_HOME/d" /etc/profile;
sed -i "/export PATH=\/usr\/local\/apache-maven-3.3.3\/bin*/d" /etc/profile;

echo 'MAVEN_HOME=/usr/local/apache-maven-3.3.3' >> /etc/profile
echo 'export MAVEN_HOME' >> /etc/profile
echo 'export PATH=/usr/local/apache-maven-3.3.3/bin:${PATH}' >> /etc/profile

source /etc/profile
