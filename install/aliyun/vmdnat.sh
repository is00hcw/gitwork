#!/bin/bash
############################################
# 阿里云VM DNAT转发脚本
#
#2015-08-19 by 金象
#version:1.0
#功能:连接有公网的IP，自动转发到指定内网服务器IP上
#
usage()
{
echo -e "\n\033[34m使用方法：\033[0m\n \
例：$0 -i IP [-s port] -d port \n\n \
$0 -i 10.xx.xx.xx -d xx
选项说明：\n \
-i(必填)	:内网服务器IP \n \
-d(必填)	:内网服务器目的端口 \n \
-s(选填)	:公网服务器的源端口,如果不填与目的端口相同 \n \
-F(选填)	:清空当前全部转发规则
"
exit
} 

check_ip_forward()
{
if [ -n "$(grep ^net.ipv4.ip_forward.*0 /etc/sysctl.conf)" ];then
	echo -e "目前尚未开启net.ipv4.ip_forward转发，是否开启?"
	read -p"yes[y] or no[n]:" -n 1 set_forward
	if [ "${set_forward}" = "y" ];then
		sed -i '/net.ipv4.ip_forward/s/^/#/' /etc/sysctl.conf
		sed -i 's/net.ipv4.ip_forward.*/&\nnet.ipv4.ip_forward = 1/' /etc/sysctl.conf
		sysctl -p &>/dev/null
	else
		echo -e "\n终止退出"
		exit
	fi
fi
}

iptables_del()
{
echo -e "$(iptables -t nat -nvL)"
echo -e "\n 是否清空当前全部转发规则?"
read -p"yes[y] or no[n]:" -n 1 set_rule_del
if [ "${set_rule_del}" = "y" ];then
	iptables -t nat -F
	iptables -t nat -Z
	echo -e "\n清空完成"
	exit
else
	echo -e "\n终止退出"
	exit
fi
}

check_ip()
{
#内网IP
internal_ip_tmp=$(ifconfig |grep -A 1 eth0|grep inet|awk -F: '{print $2}'|awk '{print $1}')
#公网IP
internat_ip_tmp=$(ifconfig |grep -A 1 eth1|grep inet|awk -F: '{print $2}'|awk '{print $1}')
if [ -n "${internal_ip_tmp}" ];then
	internal_ip=${internal_ip_tmp}
else
	echo -e "内网IP:none"
	exit
fi
if [ -n "${internat_ip_tmp}" ];then
	internat_ip=${internat_ip_tmp}
else
	echo -e "外网IP:none"
	exit
fi
}

iptables_add()
{
check_ip
echo -e "\n是否设置 ${internat_ip} 的 ${local_port}端口 转发到 ${foregin_ip} 的 ${foregin_port}端口?"
echo -e "\t${internat_ip}:${local_port} ===> ${foregin_ip}:${foregin_port}"
read -p"yes[y] or no[n]:" -n 1 set_rule
if [ "${set_rule}" = "y" ];then
	echo -e "\n"
	iptables -t nat -I PREROUTING -d ${internat_ip} -p tcp --dport ${local_port} -j DNAT --to ${foregin_ip}:${foregin_port}
	iptables -t nat -I POSTROUTING -d ${foregin_ip} -p tcp --dport ${foregin_port} -j SNAT --to ${internal_ip}
	/etc/init.d/iptables save
	echo -e "\n设置完毕"
else
	echo -e "\n终止退出"
	exit
fi
}

while getopts ":i:s:d:F" script_opt
do
	case ${script_opt} in
	i)
		foregin_ip=${OPTARG}
	;;
	s)
		local_port=${OPTARG}
	;;
	d)
		foregin_port=${OPTARG}
	;;
	F)
		iptables_del
	;;
	:)
		echo -e "\033[31mErr: -${OPTARG}选项缺少参数，请核实！\033[0m"
		usage
		;;
	?)
		echo -e "\033[31mErr: 无法识别的选项，请核实！\033[0m"
		usage
	;;
	esac
done

if [ -z "${foregin_ip}" ];then
echo -e "\033[31mErr: IP设置为空，请核实！\033[0m"
	usage
elif [[ ! ${foregin_ip} =~ ^10 ]];then
	echo -e "\033[31mErr: IP设置错误，请核实！\033[0m"
	usage
fi
if [ -z "${foregin_port}" ];then
	echo -e "\033[31mErr: 端口设置为空，请核实！\033[0m"
	usage
fi
if [ -z "${local_port}" ];then
	local_port=${foregin_port}
fi

check_ip_forward
iptables_add
  

