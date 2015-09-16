#!/bin/sh

if [ `uname -m` == "x86_64" ];then
  machine=x86_64
else
  machine=i686
fi

ant_out=`ant -version | grep "Apache Ant"`
if [ "$ant_out" != "" ]; then
  exit
fi

java_version=`java -version 2>&1  | grep "java version \"1.7"`
if [ "$java_version" == "" ]; then

  sudo mkdir -p /usr/local/java
  if [ $machine == "x86_64" ]; then
    if [ ! -f jdk-7u79-linux-x64.gz ];then
      wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/java/jdk-7u79-linux-x64.gz
    fi

    tar zxvf jdk-7u79-linux-x64.gz
    sudo mv jdk1.7.0_79/*  /usr/local/java
  else
    if [ ! -f jdk-7u79-linux-i586.gz ];then
      wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/java/jdk-7u79-linux-i586.gz
    fi
    tar zxvf jdk-7u79-linux-i586.gz
    sudo cp -rf jdk1.7.0_79/*  /usr/local/java
  fi
  sed -i "/export JAVA_HOME=\/usr\/local\/java/d" /etc/profile
  sed -i "/export JRE_HOME=\/usr\/local\/java\/jre/d" /etc/profile
  sed -i "/export PATH=\/usr\/local\/java\/bin*/d" /etc/profile

  echo 'export JAVA_HOME=/usr/local/java' >> /etc/profile
  echo 'export JRE_HOME=/usr/local/java/jre' >> /etc/profile
  echo 'export PATH=/usr/local/java/bin:$PATH' >> /etc/profile
  sudo source /etc/profile
fi


    
if [ ! -f apache-ant-1.9.6-bin.tar.gz ]; then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/apache-ant-1.9.6-bin.tar.gz
fi

tar zvxf apache-ant-1.9.6-bin.tar.gz
sudo rm -rf /usr/local/apache-ant-1.9.6
sudo mv apache-ant-1.9.6 /usr/local/

sed -i "/ANT_HOME=\/usr\/local\/apache-ant-1.9.6/d" /etc/profile;
sed -i "/export ANT_HOME/d" /etc/profile;
sed -i "/export PATH=\/usr\/local\/apache-ant-1.9.6\/bin*/d" /etc/profile;

echo 'ANT_HOME=/usr/local/apache-ant-1.9.6' >> /etc/profile
echo 'export ANT_HOME' >> /etc/profile
echo 'export PATH=/usr/local/apache-ant-1.9.6/bin:${PATH}' >> /etc/profile

sudo source /etc/profile

if [ ! -f apache-ivy-2.4.0-bin.tar.gz ]; then
    wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/lib/apache-ivy-2.4.0-bin.tar.gz
fi

tar zvxf apache-ivy-2.4.0-bin.tar.gz
cd apache-ivy-2.4.0
sudo mv ivy-2.4.0.jar /usr/local/apache-ant-1.9.6/lib
cd ..
sudo rm apache-ivy-2.4.0* -rf

