#!/usr/bin/env bash

# Copyright @ qihoo360

  export LC_ALL=C

  if [ "$(id -u)" != "0" ]
  then
    echo "This script. must be run as root" 1>&2
    exit 1
  fi
 
####check if gcc perl perl-devel(centos) or libperl-dev(ubuntu) exists,   
   APT_CMD=`whereis apt-get|awk '{print $2}'`
   YUM_CMD=`whereis yum|awk '{print $2}'`
   if [ "$APT_CMD"x != ""x ]
   then
#       echo "$APT_CMD"
       cmd=`dpkg -l|grep gcc`
       if [ "$cmd"x = ""x ]
       then
           apt-get install -y gcc 
       fi
       cmd=`dpkg -l|grep perl`
       if [ "$cmd"x = ""x ]
       then
           apt-get install -y perl 
       fi
       cmd=`dpkg -l|grep "libperl-dev"`
       if [ "$cmd"x = ""x ]
       then
           apt-get install -y  libperl-dev 
       fi
   elif [ "$YUM_CMD"x != ""x ]
   then
#      echo $YUM_CMD
      cmd=`rpm -q gcc|grep -v "not installed"`
      if [ "$cmd"x = ""x ]
      then
          yum install gcc -y 1>/dev/null 2>&1
      fi
      cmd=`rpm -q perl|grep -v "not installed"`
      if [ "$cmd"x = ""x ]
      then
          yum install -y perl 1>/dev/null 2>&1
      fi
      cmd=`rpm -q perl-devel|grep -v "not installed"`
      if [ "$cmd"x = ""x ]
      then
          yum install -y perl-devel 1>/dev/null 2>&1
      fi
   else
      echo "your release have no yum or apt-get"
   fi
   
  function Usage()
  {
       echo "用法如下：(注意：2c版本密码必须大于6位，3版本密码必须大于8位), 对于3版本，需要指定一个加密类型，MD5或者SHA";
       echo ""
       echo "    $0 -v 版本号(2代表2C，3代表版本3) -u 用户名 -p 密码 [-t 加密类型]";
       echo "    $0 -v 2 -u username -p password		//2c版本";	
       echo "    $0 -v 3 -u username -p password -t [MD5|SHA]	//3版本";
       echo "";
       exit 0;
  }
  
  if [ $# -lt 1 ]
  then
      echo "请输入参数"
      Usage
  fi
  
#####get parameters
   version=0
   username=""
   password=""
   encrytype=""

   while getopts ":v:u:p:t:"  opt;
   do
       case $opt in
       v)
            version=$OPTARG
            if [[ ${OPTARG:0:1} = "-" ]]
            then
                echo ""
                echo "-v need argument"
                echo ""
                Usage
            fi
       ;;
       u)
            username=$OPTARG
            if [[ ${OPTARG:0:1} = "-" ]]
            then
                echo ""
                echo "-u need argument"
                echo ""
                Usage
            fi
       ;;
       p)
            password=$OPTARG
            if [[ ${OPTARG:0:1} = "-" ]]
            then
                echo ""
                echo "-p need argument"
                echo ""
                Usage
            fi
       ;;
       t)
	    encrytype=$OPTARG
	    if [[ ${OPTARG:0:1} = "-" ]]
            then
		echo ""
		echo "-t need argument"
		echo ""
		Usage
	    fi
       ;;
       :)
            Usage
       ;;
       ?)
            paralist=-1;
            Usage
       ;;
       esac
   done   

###check version number, must be 2 or 3
  if [ $version -ne "3" -a $version -ne "2" ]
  then
    Usage
    exit 3
  fi
  
  if [ $version -eq "3" -a  "$username"x = ""x ]
  then
     echo "版本3必须要输入用户名"
     Usage
  fi

###check password length, version 3 big then 8, version 2 big then 6
  if [ "$version" -eq "3" ] 
  then
      if [ ${#password} -lt "8" ]
      then
          echo ""
          echo "Your passwords must greater than 8 bytes" 1>&2
          echo ""
          Usage
      fi
  else          ########### version = 2
      if [ ${#password} -lt "6" ]
      then
          echo ""
          echo "Your passwords must greater than 6 bytes" 1>&2
          echo ""
          Usage
      fi
  fi
   
   if [ "$version" -eq "3" ]
   then
	if [ "$encrytype"x = ""x ]
        then
	    encrytype="MD5"
        elif [ "$encrytype" != "MD5" -a "$encrytype" != "SHA" ]
	then
	    echo "加密类型必须为MD5或者SHA"
	    Usage
	fi
   fi
   
   TAR_TARGET="net-snmp.tar.gz"
   if [ -e $TAR_TARGET ]
   then
      cmd=`rm -rf $TAR_TARGET 1>/dev/null 2>&1` 
   fi
   echo "starting ...(wait for 10 minute)"
   cmd=`wget http://download.cloud.360.cn/yjk/net-snmp.tar.gz 1>/dev/null 2>&1`
   if [ -e $TAR_TARGET ]
   then
       cmd=`tar zxvf $TAR_TARGET`
   else 
       echo "download net-snmp.tar.gz failed"
       exit
   fi

   cd net-snmp-5.7.2
   cmd=`./configure --prefix=/usr/local/snmp --with-mib-modules=ucd-snmp/diskio -enable-mfd-rewrites --with-default-snmp-version="$version"  --with-sys-contact="@@no.where" --with-sys-location="Unknown" --with-logfile="/var/log/snmpd.log" --with-persistent-directory="/var/net-snmp" 1>/dev/null`
   cmd=`make 1>/dev/null`
   cmd=`make install 1>/dev/null`

   case $version in
     2)
     cat >> /usr/local/snmp/share/snmp/snmpd.conf << EOF
rocommunity $password 101.199.100.150
rocommunity $password 220.181.150.98
rocommunity $password 180.153.229.230
rocommunity $password 220.181.150.125
rocommunity $password 103.28.11.237
rocommunity $password 103.28.10.244
rocommunity $password 103.28.10.245

EOF
     ;;
     3)
     	cat >> /usr/local/snmp/share/snmp/snmpd.conf << EOF
	rouser $username auth
EOF
     
     ;;
     *)
     echo "Please check your input version" 1>&2
     echo
     exit 1
     ;;
   esac

  i=0
  while [ $i -lt 5 ]
  do
      ret=`/usr/local/snmp/sbin/snmpd`
      ret=`ps aux | grep -v grep | grep snmp`
      if [ "$ret"x = ""x ]
      then
          ((i=i+1))
          ret=`/usr/local/snmp/sbin/snmpd`
      else
          break
      fi
  done
  
  case $version in
  3)
#      echo "createUser $username MD5 $password" >>/var/net-snmp/snmpd.conf
      echo "createUser $username $encrytype $password" >>/var/net-snmp/snmpd.conf
  ;;
  esac
  
  pid=`ps -ef|grep snmpd|grep -v grep|awk '{print $2}'`
  echo "pid: $pid"
  if [ "$pid"x != ""x ]
  then 
      kill -9 $pid
      /usr/local/snmp/sbin/snmpd
  else
      /usr/local/snmp/sbin/snmpd
  fi     
  
  case $version in
  3)
      cmd=`cat /var/net-snmp/snmpd.conf|grep "$username"`
      if [ "$cmd"x == ""x ]
      then
          pid=`ps -ef|grep snmpd|grep -v grep|awk '{print $2}'`
          if [ "$pid"x != ""x ]
          then
              kill -9 $pid
              echo "createUser $username $encrytype $password" >>/var/net-snmp/snmpd.conf
          fi
      fi
  ;;
  esac
 
  ret=`ps -ef | grep -v grep | grep snmp`
  if [ "$ret"x != ""x ]
  then
    echo "snmp start success"
    echo
  else
    echo "snmp start failed"
    echo
    exit 4
  fi
 
  echo "/usr/local/snmp/sbin/snmpd" >>/etc/rc.local

  echo "Finish..."
  echo
  exit 0
