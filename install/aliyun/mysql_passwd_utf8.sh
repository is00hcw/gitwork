#! /bin/bash
############################################
#              mysql密码修改脚本         
#
#2013-09-03 by 金象
#version:1.1
#使用方法：
#例：./mysql_paswd.sh -u 账号 -p 密码 -s -x 
#
#选项说明：
# -u(选填)  :mysql账号，默认为root 
# -p(必填)  :mysql密码 
# -s(选填)  :查询当前mysql远程连接权限 
# -x(选填)  :增加mysql远程连接权限		       
#
#2014-04-22
#version:1.1
#修复对新版一键安装包mysql的路径检测
#
############################################

clear
###通过mysql进程查找mysql路径：
mysql_find_proc()
{
###存档IFS，取回车作分隔符。
IFS_tmp=$IFS
IFS=${IFS:2:1}
mysql_path_tmp=$(ps x|grep mysqld|grep -E -v "grep|${0##*/}")
IFS=${IFS_tmp}
###截取mysql所在路径
mysql_path=$(echo ${mysql_path_tmp%/bin/mysqld_safe*}|awk '{print $NF}')
}

###确定进程是否存在，标示变量is_path
mysql_is_path()
{
if [ -n "${mysql_path}" ]; then
	is_path=1
else
	is_path=0
fi
}

###mysql进程不存在时，通过文件查找mysql路径
mysql_find_file()
{
if [ "${is_path}" -eq 0 ]; then
	echo -e "\033[34m当前mysql没有启动，尝试启动mysql...\033[0m"
	mysql_path=$(cat /etc/my.cnf |grep basedir|awk '{print $NF}')
	if [ -f "/alidata/server/mysql/bin/mysqld_safe" ];then
		/etc/init.d/mysqld start
		sleep 2
		mysql_find_proc
		mysql_is_path
	else
		echo -e "\033[34m尝试查找mysql路径，时间较长，请稍等...\033[0m"
		mysql_file_tmp=$(find / -name "mysql.server"|grep "alidata"|tail -1)
		if [ -n "${mysql_file_tmp}" ]; then
			for start_test in ${mysql_file_tmp}
			do
				echo "尝试启动mysql路径：${start_test}"
				${start_test} start
				sleep 2
				mysql_find_proc
				mysql_is_path
			if [ "${is_path}" -eq 1 ]; then
				echo -e "\033[32mmysql启动成功\033[0m\n"
				break
			fi
			done
		else
			mysql_file_tmp=$(find / -name "mysqld_safe"|grep "bin/mysqld_safe")
			mysql_path={mysql_file_tmp%/bin/mysqld_safe*}
			if [ -f "${mysql_path}/bin/mysqld_safe" ];then
				${mysql_path}/bin/mysqld_safe &
				sleep 2
				mysql_find_proc
				mysql_is_path
			fi
			if [ -z "${mysql_path}" ]; then
				echo -e "\033[31m没有找到mysql路径，请手动修改密码。\033[0m"
				exit
			fi
		fi
		if [ "${is_path}" -ne 1 ]; then
			echo -e "\033[31mmysql启动失败\033[0m"
			echo -e "\033[31m修改失败，请手动修改密码。\033[0m"
			exit
		fi
	fi
fi	
}

###停止mysql进程
mysql_stop()
{
echo -e "\033[34mmysql关闭中...\033[0m"
mysql_file_tmp=${mysql_path}
if [ -f "${mysql_file_tmp}/bin/mysqld_safe" ];then
	/etc/init.d/mysqld stop
	sleep 3
else
	echo -e "\033[31m停止失败\033[0m"
	echo -e "\033[31m修改失败，请手动修改密码。\033[0m"
	exit
fi
}

###跳过权限启动
mysql_skip_grant()
{
mysql_stop
echo -e "\n\033[34mmysql跳过权限启动中...\033[0m"

if [ -f "${mysql_path}/bin/mysqld_safe" ];then
	sed -i 's/^\[mysqld\]/&\nskip-grant-tables   #jinxiang_mysqlpasswd/' /etc/my.cnf
	/etc/init.d/mysqld start
	sleep 3
	mysql_find_proc
	mysql_is_path
else
	echo -e "\033[31m跳过权限启动失败\033[0m\n"
	echo -e "\033[31m修改失败，请手动修改密码。\033[0m"
	exit
fi
if [ "${is_path}" -eq 1 ]; then
	echo -e "\033[32m跳过权限启动成功\033[0m\n"
else
	echo -e "\033[31m跳过权限启动失败\033[0m\n"
	echo -e "\033[31m修改失败，请手动修改密码。\033[0m"
	exit
fi
}

###操作执行判断
mysql_succ_fail()
{
if [ "$?" -eq 0 ]; then
	echo -e "\033[32m执行成功\033[0m\n"
else
	echo -e "\033[31m执行失败\033[0m\n"
	echo -e "\033[31m修改失败，请手动修改密码。\033[0m\n"
	exit
fi
}

###修改密码，刷新权限
mysql_update_passwd()
{
echo -e "\n\033[34m修改密码，刷新权限...\033[0m"
if [ -f "${mysql_path}/bin/mysql" ];then
	${mysql_path}/bin/mysql -e "update mysql.user set password=PASSWORD('${mysql_passwd}') where user='${mysql_user}'" && \
	${mysql_path}/bin/mysql -e "flush privileges"
	mysql_succ_fail
else
echo ${mysql_path}
	echo -e "\033[31m路径错误，密码修改失败\033[0m\n"
	exit
fi
}

###正常修改密码，刷新权限
mysql_update_passwd_normal()
{
echo -e "\n\033[34m修改密码，刷新权限...\033[0m"
mysql_connect
if [ "$?" -eq 0 ]; then
	if [ -f "${mysql_path}/bin/mysql" ];then
		${mysql_path}/bin/mysql -u${mysql_user} -p"${mysql_passwd}" -e "update mysql.user set password=PASSWORD('${mysql_passwd}') where user='${mysql_user}'" && \
		${mysql_path}/bin/mysql -u${mysql_user} -p"${mysql_passwd}" -e "flush privileges"
		mysql_succ_fail
	else
		echo -e "\033[31m路径错误，密码修改失败\033[0m\n"
		exit
	fi
else
	echo -e "\033[31m当前密码错误，请尝试强制修改密码\033[0m\n"
	final_modifi
fi
}

###正常启动mysql
mysql_start()
{
mysql_stop
echo -e "\n\033[34mmysql正常启动中...\033[0m"
sed -i '/jinxiang_mysqlpasswd/d' /etc/my.cnf
/etc/init.d/mysqld start
sleep 3
if [ "${is_path}" -eq 0 ]; then
	echo -e \033[31m"正常启动失败\033[0m\n"
	exit
else
	echo -e "\033[32m正常启动成功\033[0m\n"
fi
}

###mysql连接测试
mysql_connect()
{
mysql_find_proc
mysql_is_path
if [ "${is_path}" -eq 1 ]; then
	${mysql_path}/bin/mysql -u"${mysql_user}" -p"${mysql_passwd}" -e "flush privileges"
fi
}

###mysql查询远程连接权限
mysql_select_privilege()
{
mysql_find_proc
mysql_is_path
if [ "${is_path}" -eq 1 ]; then
	${mysql_path}/bin/mysql -u"${mysql_user}" -p"${mysql_passwd}" -e "select host,user,password from mysql.user where user='${mysql_user}'"
	${mysql_path}/bin/mysql -u"${mysql_user}" -p"${mysql_passwd}" -e "flush privileges"
else
	echo -e "\033[31mmysql没有启动，请启动mysql\033[0m\n"
	mysql_find_file
fi
}

###mysql授权远程连接权限
mysql_grant_privilege()
{
mysql_find_proc
mysql_is_path
if [ "${is_path}" -eq 1 ]; then
	${mysql_path}/bin/mysql -u"${mysql_user}" -p"${mysql_passwd}" -e "update mysql.user set host='%' where user='${mysql_user}'"
	${mysql_path}/bin/mysql -u"${mysql_user}" -p"${mysql_passwd}" -e "flush privileges"
else
	echo -e "\033[31mmysql没有启动，请启动mysql\033[0m\n"
	mysql_find_file
fi
}

###脚本帮助
usage()
{
echo -e "\n\033[34m使用方法：\033[0m\n \
例：$0 -p 密码 [-u 账号] [-s] [-x] \n\n \
选项说明：\n \
-p(必填)	:mysql密码 \n \
-u(选填)	:mysql账号，默认为root \n \
-s(选填)	:查询当前mysql远程连接权限 \n \
-x(选填)	:增加mysql远程连接权限 \n \
" 
}

###mysql修改密码函数调用
mysql_modifi_passwd()
{
mysql_find_proc
mysql_is_path
mysql_find_file
mysql_skip_grant
mysql_update_passwd && mysql_start
}

###脚本选项、参数定义
while getopts ":u:p:sx" opt
do
	case $opt in
		u)
		mysql_user=${OPTARG};;
		p)mysql_passwd=${OPTARG};;
		s)
		mysql_select_opt=1;;
		x)
		mysql_grant_opt=1;;
		?)
		echo -e "\033[31m无法识别的选项，请核实！\033[0m"
		usage
		exit;;
	esac	
done

###设定默认账号
mysql_user=${mysql_user:-root}
###检查密码
if [ -z "${mysql_passwd}" ]; then
	echo -e "\033[31m请填写密码\033[0m"
	usage
	exit
fi

###无密码修改操作确认
final_modifi()
{
echo -e "是否需要将账号：${mysql_user} 的密码修改为：${mysql_passwd}"
read -p"yes[y] or no[n]:" -n 1 mysql_option
if [ "${mysql_option}" = "y" ];then
	echo -e "\n"
	mysql_modifi_passwd
	exit
else
	echo -e "\n\n取消操作\n"
	exit
fi
}

###常规修改操作确认
final_modifi_normal()
{
mysql_find_proc
mysql_is_path
mysql_find_file
echo -e "是否需要将账号：${mysql_user} 的密码修改为：${mysql_passwd}"
read -p"yes[y] or no[n]:" -n 1 mysql_option
if [ "${mysql_option}" = "y" ];then
	echo -e "\n"
	mysql_update_passwd_normal
	exit
else
	echo -e "\n\n取消操作\n"
	exit
fi
}

### -p 选项执行普通方式密码修改操作
if [[ "$*" =~ "-p" ]] && [ $# -eq 2 ];then
	mysql_connect
	if [ "$?" -eq 0 ]; then
		echo -e "\033[34mmysql密码修改：\033[0m"
		final_modifi_normal
	else
		echo -e "\033[31m当前密码错误，请尝试强制修改密码\033[0m\n"
		final_modifi
	exit
	fi
### -u -p 选项执行普通方式密码修改操作
elif [[ "$*" =~ "-u" ]] && [[ "$*" =~ "-p" ]] && [ $# -eq 4 ];then
	mysql_connect
	if [ "$?" -eq 0 ]; then
		echo -e "\033[34mmysql密码修改：\033[0m"
		final_modifi_normal
	else
		echo -e "\033[31m当前密码错误，请尝试强制修改密码\033[0m\n"
		final_modifi
	exit
	fi
### -s 选项执行select操作
elif [[ "${mysql_select_opt}"x == "1x" ]] && [[ "${mysql_grant_opt}"x != "1x" ]];then
	mysql_connect
	if [ "$?" -eq 0 ]; then
		echo -e "mysql当前连接权限："
		mysql_select_privilege
	else
		echo -e "\033[31m当前密码错误，请尝试强制修改密码\033[0m\n"
		final_modifi
	exit
	fi
### -s -x选项同时存在时，不再重复执行select操作，仅执行-x选项操作
else
	mysql_connect
	if [ "$?" -eq 0 ]; then
		echo -e "mysql当前连接权限："
		mysql_select_privilege
		mysql_grant_privilege
		echo -e "mysql修改后连接权限："
		mysql_select_privilege
		exit
	else
		echo -e "\033[31m当前密码错误，请尝试强制修改密码\033[0m\n"
		final_modifi
	fi
fi
