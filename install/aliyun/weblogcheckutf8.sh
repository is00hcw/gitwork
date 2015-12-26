#!/bin/bash
############################################
# web日志分析脚本
#
#2013-12-30 by 金象
#version:1.0
#使用方法：
#./weblogcheck.sh [-c n] [-t n] -f FILE
#
#选项说明：
#-c(选填):设置IP、资源TOP榜显示量，默认显示前5名，参数需填写整数
#-t(选填):设置日志统计时段，默认统计最后6个时段，参数需填写整数
#-f(必填):指定日志文件，如果脚本与日志文件不在同一目录需填写绝对路径
#例：
#./weblogcheck.sh -f /alidata/log/httpd/access/phpwind.log
#./weblogcheck.sh -c 3 -t 3 -f /alidata/log/httpd/access/phpwind.log
############################################

##使用帮助
usage()
{
	echo -e "\nUsage:\n$0 [-c n] [-t n] -f FILE\n"
	echo -e "选项说明:"
	echo -e "-c(选填):设置IP、资源TOP榜显示量，默认显示前5名，参数需填写整数"
	echo -e "-t(选填):设置日志统计时段，默认统计最后6个时段，参数需填写整数"
	echo -e "-f(必填):指定日志文件，如果脚本与日志文件不在同一目录需填写绝对路径"
	echo -e "\n例：\n$0 -f /alidata/log/httpd/access/phpwind.log"
	echo -e "或：\n$0 -c 3 -t 3 -f /alidata/log/httpd/access/phpwind.log\n"
	exit
}
##华丽的分割线
split_line="--------------------------------------------------"
clear
##审核选项
while getopts ":hc:t:f:" script_opt
do
	case ${script_opt} in
		h)
		time_hz=half
		;;
		c)
		if [[ ${OPTARG} =~ ^[1-9][0-9]*$ ]];then
			ip_row=${OPTARG}
		else
			echo -e "\033[31mErr: -c选项请填写整数TOP榜显示行\033[0m"
			usage
		fi
		;;
		t)
		if [[ ${OPTARG} =~ ^[1-9][0-9]*$ ]];then
			log_time=${OPTARG}
		else
			echo -e "\033[31mErr: -t选项请填写整数时段\033[0m"
			usage
		fi
		;;
		f)
		if [ -e "${OPTARG}" ];then
			log_path=${OPTARG}
		else
			echo -e "\033[31mErr: ${OPTARG}日志文件不存在，请核实！\033[0m"
			usage
		fi
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
##检测日志文件是否可用
if [ -z "${log_path}" ];then
	echo -e "\033[31mErr: 请填写日志路径\033[0m"
	usage
fi
##检测日志文件大小
log_size=$(du -m "${log_path}"|awk '{print $1}')
if [ "${log_size}" -gt 50 ];then
	echo -e "日志文件:${log_path}\t大小:${log_size}MB\n日志文件体积较大，分析时间较长，是否继续?"
	read -p"yes[y] or no[n]:" -n 1 check_size
	if [ "${check_size}" = "y" ];then
	echo -e "\n正在分析，请稍等..."
	else
	echo -e "\n终止日志分析"
	exit
	fi
elif [ "${log_size}" -eq 0 ];then
	echo -e "日志文件:${log_path}\t大小:${log_size}MB\n\033[31m日志文件为空，请选择其他日志\033[0m"
	usage
fi
##设置时间分隔点
time_mark=$(awk '{print $4}' "${log_path}"|cut -c 2-16|uniq|tail -n ${log_time:-6})
##日志分析
for mark in ${time_mark}
do
	time_format=$(echo $mark|awk 'BEGIN {FS="[/|:]"} {print $3"/"$2"/"$1"\t"$4":00-"$4":59"}')
	net_size=$(grep $mark "${log_path}"|awk '{if($10 ~ /[0-9]/) sum += $10} END {printf("%0.2f\n",sum/1024/1024)}')
	top_ip=$(grep $mark "${log_path}"| awk '{print $1}' |sort |uniq -c|sort -rn|head -n ${ip_row:-5})
	top_page=$(grep $mark "${log_path}"|awk '{if($10>0 )print $7}'|sort|uniq -c|sort -rn|head -n ${ip_row:-5})
	echo -e "${split_line}\n${time_format}   本时段流量:${net_size} MB"
	echo -e "  次数 访问者IP"
	echo -e "${top_ip}"
	echo -e "  次数 访问资源"
	echo -e "${top_page}"
done
