#!/bin/bash
#userdel tomcat7
#groupadd tomcat7
#useradd -g tomcat7 -M -s /usr/sbin/nologin tomcat7 &> /dev/null
rm -rf apache-tomcat-7.0.63
if [ ! -f apache-tomcat-7.0.63.tar.gz ];then
  wget http://aliyun-dep.oss-cn-beijing.aliyuncs.com/tomcat/apache-tomcat-7.0.63.tar.gz
fi
tar zxvf apache-tomcat-7.0.63.tar.gz
mv apache-tomcat-7.0.63/*  /aliyun/server/tomcat

groupadd www
useradd -g www -s /sbin/nologin www
chmod u+x -R /aliyun/server/tomcat/bin
chown www:www -R /aliyun/server/tomcat/
chmod 777 -R /aliyun/server/tomcat/logs
chmod 777 -R /aliyun/server/tomcat/work
chmod 777 /aliyun/server/tomcat/bin/startup.sh
nohup /aliyun/server/tomcat/bin/startup.sh

