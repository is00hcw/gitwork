#!/bin/bash
############################################
#           ssh远程检查脚本         
#
#2014-03-26 by 金象
#version:1.0
#使用方法：
#例：./vmsshcheck.sh
#
#脚本检查机制：
#1、检测重要文件权限
#2、检测ssh端口及root权限
#3、检测网卡IP地址
#4、检查开机磁盘自检
#5、检查NetworkManager服务状态
############################################
#华丽的分隔线
split_line="--------------------------------------------------"

#重要文件权限检查
check_permi()
{
	#文件权限检查列表
	file_ssh_rsa=/etc/ssh/ssh_host_rsa_key
	file_ssh_dsa=/etc/ssh/ssh_host_dsa_key
	doc_ssh_empty=/var/empty/sshd/
	file_passwd=/etc/passwd
	file_shadow=/etc/shadow
	
	echo ${split_line}
	echo "检查文件权限:"

	for file_current in ${file_ssh_rsa} ${file_ssh_dsa} ${doc_ssh_empty} ${file_passwd} ${file_shadow}
	do
		file_permi=$(ls -ld ${file_current}|awk '{print $1}')
		case ${file_current} in
		${file_ssh_rsa}|${file_ssh_dsa})
			if [ "${file_permi}" != "-rw-------" ];then
			echo "风险权限"
			ls -ld ${file_current}
			chmod 600 ${file_current} && echo "已经修复"
			fi
		;;
		${doc_ssh_empty})
			if [ "${file_permi}" != "drwx--x--x." ];then
			echo "风险权限"
			ls -ld ${file_current}
			chmod 711 ${file_current} && chown root.root ${file_current} && echo "已经修复"
			fi
		;;
		${file_passwd})
			if [ "${file_permi}" != "-rw-r--r--" ];then
			echo "风险权限"
			ls -ld ${file_current}
			chmod 644 ${file_current} && echo "已经修复"
			fi
		;;
		${file_shadow})
			if [ "${file_permi}" != "----------" ];then
			echo "风险权限"
			ls -ld ${file_current}
			chmod 000 ${file_current} && echo "已经修复"
			fi
		esac
	done
	/etc/init.d/sshd restart
}

#NetworkManager服务检查
check_NM()
{
	echo ${split_line}
	echo "检查NetworkManager服务:"
	networkmanager_status=$(chkconfig --list|grep NetworkManager|grep on)
	if [ -n "${networkmanager_status}" ];then
		echo "NetworkManager 服务处于启动状态，正在修复"
		/etc/init.d/NetworkManager stop
		chkconfig NetworkManager off
		/etc/init.d/network restart
	fi
}

#ssh端口检查
check_sshd()
{
	echo ${split_line}
	echo "检查ssh端口:"
	
	sshd_port_tmp=$(grep -i ^port /etc/ssh/sshd_config|awk '{print $2}')
	sshd_port=${sshd_port_tmp:-22}
	sshd_root_state_tmp=$(grep ^PermitRootLogin /etc/ssh/sshd_config|tail -1|awk '{print $2}'|tr [A-Z] [a-z])
	sshd_root_state=${sshd_root_state_tmp:-yes}
	sshd_passwd_state_tmp=$(grep ^PasswordAuthentication /etc/ssh/sshd_config|tail -1|awk '{print $2}'|tr [A-Z] [a-z])
	sshd_passwd_state=${sshd_passwd_state_tmp:-yes}
	echo -e "ssh端口为:"${sshd_port}
	echo -e "ssh允许root登陆:${sshd_root_state}"
	echo -e "ssh允许密码验证:${sshd_passwd_state}"
}

#网卡IP检查
check_ip()
{
	echo ${split_line}
	echo "检查网卡IP:"
	
	internal_ip=$(ifconfig |grep -A 1 eth0|grep inet|awk -F: '{print $2}'|awk '{print $1}')
	internat_ip=$(ifconfig |grep -A 1 eth1|grep inet|awk -F: '{print $2}'|awk '{print $1}')
	if [ -n "${internal_ip}" ];then
		echo -e "内网IP:"${internal_ip}
	else
		echo -e "内网IP:none"
	fi
	if [ -n "${internat_ip}" ];then
                echo -e "外网IP:"${internat_ip}
        else
                echo -e "外网IP:none"
        fi
	is_icmp=$(cat /proc/sys/net/ipv4/icmp_echo_ignore_all)
	if [ "${is_icmp}x" == "1"x ];then
	echo -e "icmp:已禁ping"
	fi
}

#磁盘开机挂载检查
check_fstab()
{
	echo ${split_line}
	echo "检查磁盘开机挂载:"
	disk_dev=$(cat /etc/fstab |awk '{print $1}'|grep -E "^/dev|^UUID|^uuid"|sort|uniq -c|awk '{if ($1>1) print $2}')
	if [ -n "${disk_dev}" ];then
		echo "磁盘重复挂载，请去除以下重复项目："
		for err_dev in ${disk_dev[*]}
		do
			grep ${err_dev} /etc/fstab
		done
	fi
}

#执行脚本
check_sshd

check_ip

check_permi

check_NM

check_fstab

