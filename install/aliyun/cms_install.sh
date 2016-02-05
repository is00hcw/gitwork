#!/bin/bash
#get aegis client version, if it less than 60, just use the old way
aegis_version=`ps ax | grep '/usr/local/aegis/aegis_client/' | grep -v grep | awk '{print $5}' | awk -F/ '{print $6}' | awk -F_ '{print $3}'`
if [[ $aegis_version -lt 60 ]]; then
    echo -en "\033[0;31maegis version is smaller than 60, pls upgrade it first\n"
    exit 1
fi

domain_name='update'
packet_loss=`ping -c 2 -w 2 update2.aegis.aliyun.com  | grep 'packet loss' | awk -F',' '{print $3}' | awk -F' ' '{print $1}'`
if [[ $packet_loss = '0%'  ]]; then
    domain_name='update2'
else
	packet_loss=`ping -c 2 -w 2 update3.aegis.aliyun.com  | grep 'packet loss' | awk -F',' '{print $3}' | awk -F' ' '{print $1}'`
	if [[ $packet_loss = '0%'  ]]; then
	    domain_name='update3'
	fi
fi

#to avoid the registration of aegis client with smaller vertion(like 33,35), aegis server try to upgrade immediately, but not download the aegis_quartz.zip
#here download aegis_quartz.zip and start it mannually
mkdir -p /usr/local/aegis/aegis_quartz
cd /usr/local/aegis/aegis_quartz

echo "downloading file from $domain_name.aegis.aliyun.com"

bit_version=`uname -m`
if [[ $bit_version = 'x86_64' ]]; then
     wget http://$domain_name.aegis.aliyun.com/download/linux64/modules/aegis_quartz.zip -O aegis_quartz.zip
else
     wget http://$domain_name.aegis.aliyun.com/download/linux32/modules/aegis_quartz.zip -O aegis_quartz.zip
fi

#start the quartz
quartz_exists=`ps ax | grep '/usr/local/aegis/aegis_quartz/aegis_quartz' | grep -v grep | wc -l`
if [[ $quartz_exists -eq 0 ]]; then
    #unzip with update
    unzip -u aegis_quartz.zip

	echo "starting aegis_quartz ..."
    /usr/local/aegis/aegis_quartz/aegis_quartz &
    echo "aegis_quartz started ..."
fi

#remove cmscfg because of the mistaken download by aegis client with smaller version
if [[ -f /usr/local/aegis/cmscfg ]]; then
     rm -rf /usr/local/aegis/cmscfg
fi
