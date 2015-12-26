#!/bin/bash
############################################
#           vm负载状态检查脚本         
#
#2014-04-03 by 金象
#version:1.1
#使用方法：
#例：./vmstatuscheck.sh
#
#脚本检查机制：
#1、检测内外网IP、掩码
#2、检测网关路由设置
#3、检测DNS设置、域名解析
#4、检查磁盘空间使用量
#5、检查开机挂载文件
#6、检查负载情况
#7、检查防火墙状态(v.1增加)
#
#脚本参数说明：
#-x(可选):增加计划任务，用于监控服务器状态
#-xx(可选):删除计划任务
#
#更新信息：
#v1.1：
#2014-04-04
#增加防火墙检测
#增加输出日志格式格式转换，支持windows系统记事本查看
#
############################################

#华丽的分隔线
split_line="-------------------------------------------------------------"
split_line2='#############################################################'
#输出文件定义
log_file=vmlog_$(date +%F).log
#获取脚本名称
script_name=$(basename $0)

#时间标签
check_time()
{
	echo ${split_line2}
	date "+%F %T"
	echo ${split_line}
}

#IP地址检查
check_ip()
{
	echo "Check IP:"
	internal_ip=$(ifconfig |grep -A 1 eth0|grep inet|awk -F: '{print $2}'|awk '{print $1}')
	internal_mask=$(ifconfig |grep -A 1 eth0|grep inet|awk -F: '{print $4}'|awk '{print $1}')
	internat_ip=$(ifconfig |grep -A 1 eth1|grep inet|awk -F: '{print $2}'|awk '{print $1}')
	internat_mask=$(ifconfig |grep -A 1 eth1|grep inet|awk -F: '{print $4}'|awk '{print $1}')
	if [ -n "${internal_ip}" ];then
		echo -e "Private IP:\t"${internal_ip}"\tPrivate mask:\t${internal_mask}"
	else
		echo -e "Private IP:\tnone"
	fi
	if [ -n "${internat_ip}" ];then
		echo -e "Public  IP:\t"${internat_ip}"\tPublic  mask:\t${internat_mask}"
	else
		echo -e "Public  IP:\tnone"
	fi
	is_icmp=$(cat /proc/sys/net/ipv4/icmp_echo_ignore_all)
	if [ "${is_icmp}x" == "1"x ];then
	echo -e "icmp:\tdisable"
	fi
	echo ${split_line}
}

#检查DNS设置
check_dns()
{
	echo "Check DNS:"
	cat /etc/resolv.conf|grep -E -v "^#|^$"
	echo ${split_line}
	echo "Check Resolve:"
	ping_status=$(ping -c 4 -i 0.001 www.aliyun.com 2>&1 |grep -E -v "^$|PING")
	if [ -n "$(echo "${ping_status}"|grep unknown)" ];then
		echo "${ping_status}"
		echo -e "\033[31mDNS Error,please check /etc/resolv.conf or iptables\033[0m"
	else 
		echo "${ping_status}"
	fi
	echo ${split_line}
}

#检查路由
check_route()
{
	echo "Check route:"
	internal_gw=$(route -n |grep eth0|grep "^10\.0\.0\.0"|awk '{print $2}')
	internat_gw=$(route -n |grep eth1|grep "^0\.0\.0\.0"|awk '{print $2}')
	if [ -n "${internal_gw}" ];then
		echo -e "Private Gateway:\t${internal_gw}"
	else
		echo -e "\033[31mroute Error,please check\033[0m"
	fi
	if [ -n "${internat_gw}" ];then
		echo -e "Public  Gateway:\t${internat_gw}"
	else
		echo -e "\033[31mroute Error,please check\033[0m"
	fi
	echo ${split_line}
}

#检查防火墙
check_iptables()
{
	echo "Check iptables:"
	fw_status=$(iptables -nL|grep DROP)
	if [ -n "${fw_status}" ];then
		echo -e "\033[31mplease check iptables\033[0m"
		echo "${fw_status}"
	else
		echo pass
	fi
	echo ${split_line}
}

#磁盘空间
check_disk()
{
	echo "Check Disk:"
	df -h|grep "^/dev"
	test -n "$(df -h|grep "^/dev"|grep 100%)" && echo -e "\033[31merror,please check disk space!\033[0m"
	
	echo ${split_line}
}

#检查开机挂载文件
check_fstab()
{
	echo "Check mount file:"
	disk_dev=$(cat /etc/fstab |awk '{print $1}'|grep -E "^/dev|^UUID|^uuid"|sort|uniq -c|awk '{if ($1>1) print $2}')
	if [ -n "${disk_dev}" ];then
		echo -e "\033[31mmount error\033[0m，please check file /etc/fstab："
		for err_dev in ${disk_dev[*]}
		do
			grep ${err_dev} /etc/fstab
		done
	else
		echo "pass"
	fi
	echo ${split_line}
}

#检查vm负载
check_load()
{
	vm_load_top=$(top -n 1 -c -b|sed -n '1,7p')
	vm_load=$(top -n 1 -c -b|sed -n '8,$p'|grep -v -w "$(echo $$)"|awk '{if ($9>0)print $0}'|sort -rn -k 9|head -10)
	echo "Check vm Load:"
	if [ -n "${vm_load}" ];then
		echo "${vm_load_top}"
		echo "${vm_load}"
	else
		echo "pass"
	fi
	echo ${split_line}
}

start_script()
{
	check_time
	check_ip
	check_route
	check_dns
	check_iptables
	check_disk
	check_fstab
	check_load
}

normal_script()
{
	clear
	echo "checking..."
	start_script |tee ${log_file}
	sed -i 's/$/\r/' ${log_file}
	echo "The log has been input to: $(pwd)/${log_file}"
}

crond_script()
{
	if [ -e "/tmp/${script_name}" ];then
		check_crond=$(grep "${script_name}" /etc/crontab)
		if [ -n "${check_crond}" ];then
			start_script |tee -a /tmp/${log_file}
			echo "The crond has been create"
		else
			echo "*/5 * * * *	root	/tmp/${script_name} -x" >>/etc/crontab
			start_script |tee -a /tmp/${log_file}
			echo "The crond create succeed"
		fi
	else
		cp -rp ${script_name} /tmp/
		chmod 755 /tmp/${script_name}
		echo "*/5 * * * *	root	/tmp/${script_name} -x" >>/etc/crontab
		/tmp/${script_name} -x
		echo "The crond create succeed"
	fi
}

del_crond()
{
	rm -rf /tmp/${script_name}
	rm -rf /tmp/${log_file}
	sed -i "/${script_name}/d" /etc/crontab
	echo "Delete the script has been completed"
}

if [ "$1" == "-x" ];then
	crond_script
elif [ "$1" == "-xx" ];then
	del_crond
	
else
	normal_script
fi

