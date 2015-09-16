#!/bin/bash

##使用方法
usage()
{
 echo -ne "usage:\n$0 [eth0|eth1]"
 exit
}
##显示带宽
show_net()
{
 recv1=$(cat /sys/class/net/${vm_interface}/statistics/rx_bytes)
 send1=$(cat /sys/class/net/${vm_interface}/statistics/tx_bytes)
 sleep 1
 recv2=$(cat /sys/class/net/${vm_interface}/statistics/rx_bytes)
 send2=$(cat /sys/class/net/${vm_interface}/statistics/tx_bytes)
 recv_Bps=$(($recv2-$recv1))
 send_Bps=$(($send2-$send1))
 recv_KBps=$(echo "${recv_Bps} 1024" |awk '{printf("%0.2f\n",$1/$2)}')
 send_KBps=$(echo "${send_Bps} 1024" |awk '{printf("%0.2f\n",$1/$2)}')
 recv_Mbps=$(echo "${recv_KBps} 1024 8" |awk '{printf("%0.2f\n",$1/$2*$3)}')
 send_Mbps=$(echo "${send_KBps} 1024 8" |awk '{printf("%0.2f\n",$1/$2*$3)}')
 echo -ne "\033[5;1Hinterface:${vm_interface}\t\t\033[31mInBand:${recv_KBps} KB/s (${recv_Mbps} Mb/s) \t\tOutBand:${send_KBps} KB/s (${send_Mbps} Mb/s\033[0m)                                     "
}
##检查ssh服务状态
check_sshd()
{
 sshd_port_tmp=$(grep -i ^port /etc/ssh/sshd_config|awk '{print $2}')
 sshd_port=${sshd_port_tmp:-22}
 sshd_root_state_tmp=$(grep ^PermitRootLogin /etc/ssh/sshd_config|tail -1|awk '{print $2}'|tr [A-Z] [a-z])
 sshd_root_state=${sshd_root_state_tmp:-yes}
 sshd_passwd_state_tmp=$(grep ^PasswordAuthentication /etc/ssh/sshd_config|tail -1|awk '{print $2}'|tr [A-Z] [a-z])
 sshd_passwd_state=${sshd_passwd_state_tmp:-yes}
 echo -ne "\033[2;1HSSH Port:"${sshd_port}
 echo -ne "\033[2;45HSSH root Login:${sshd_root_state}"
 echo -ne "\033[2;90HSSH Password Authentication:${sshd_passwd_state}"
}
##检查IP
check_ip()
{
 internal_ip=$(ifconfig |grep -A 1 eth0|grep inet|awk -F: '{print $2}'|awk '{print $1}')
 internat_ip=$(ifconfig |grep -A 1 eth1|grep inet|awk -F: '{print $2}'|awk '{print $1}')
 if [ -n "${internal_ip}" ];then
  echo -ne "\033[1;19HPrivate IP:"${internal_ip}
 else
  echo -ne "\033[1;19HPrivate IP:none"
 fi
 if [ -n "${internat_ip}" ];then
                echo -ne "\033[1;45HPublic IP:"${internat_ip}
        else
                echo -ne "\033[1;45HPublic IP:none"
        fi
 is_icmp=$(cat /proc/sys/net/ipv4/icmp_echo_ignore_all)
 #if [ "${is_icmp}x" == "1"x ];then
 #echo -ne "\033[1;90HICMP:Deny ping"
 #fi
}
##netstat状态
curr_conn_net()
{
 curr_conn_tcp=$(netstat -anp|grep ^tcp|grep -v :::|grep ESTABLISHED |sort -rn -k 3|awk '{print $1," Recv-Q:",$2,"\tSend-Q:",$3,"\t  Local:",$4,"\tForeign:",$5,"\tPID/Name:",$NF}')
 if [ -n "${curr_conn_tcp}" ];then
  echo -ne "\r\033[K${curr_conn_tcp}\n\n"|grep -v 132|head -15
 fi
 curr_conn_udp=$(netstat -anp|grep ^udp|grep -v ::|grep ESTABLISHED |sort -rn -k 3|awk '{print $1," Recv-Q:",$2,"\tSend-Q:",$3,"\t  Local:",$4,"\tForeign:",$5,"\tPID/Name:",$NF}')
 if [ -n "$curr_conn_udp" ];then
  echo -ne "\r\033[K${curr_conn_udp}"|grep -v 132|head -15
 fi
}

##脚本参数检查
if [ $# -gt 1 ];then
 usage
elif [ $# -eq 0 ];then
 :
else
 if [ "$1"x != "eth0"x ] && [ "$1"x != "eth1"x ];then
 usage
 fi
fi
##设定检测网卡
vm_interface=${1:-eth1}
##网卡文件检查
if [ ! -e /sys/class/net/${vm_interface} ];then
 echo "\033[4;25Hinterface:${vm_interface} inexistence!"
 usage
 exit
fi
clear
##按q退出
stty intr e
echo -ne "\033[4;1H\033[31mPress e to Exit!\033[0m"
##开始执行
check_sshd
check_ip

##循环显示
while true
do
##隐藏提示符
echo -ne "\033[?25l"
show_net ${vm_interface}
curr_conn_net
echo -e "\033[?25h"
done
