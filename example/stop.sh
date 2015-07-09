#!/bin/bash
cd /data/www/webapp.atsmart.io/app/m5/logs

#rm *.log
#sudo /apache-tomcat-7.0.55/bin/shutdown.sh
pid=`ps -ef|grep tomcat | grep  "catalina.sh" | awk '{print $2}'`
echo "tomcat pid $pid"
if[ "$pid" != ""]; then
#sudo kill 9 pid
echo "should kill $pid"
fi 
ps aux | grep tomcat
