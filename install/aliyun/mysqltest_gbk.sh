#!/bin/bash
############################################
#           mysql测试工具         
#
#2014-04-18 by 金象
#version:1.0
#使用方法：
#例：./mysqltest.sh
#
############################################

mysql_path_check()
{
	which mysql 2>/dev/null && mysql_path=$(which mysql|head -1) || read -p "请输入mysql路径，如：/usr/local/mysql/bin/mysql :" mysql_path
	if [ ! -e "${mysql_path}" ];then
		echo "mysql路径错误，请核实"
		exit
	fi
}

input_info()
{
	clear
	#用户名
	read -p "请输入mysql用户名，不填则默认为root :" username
	stty -echo
	read -p "请输入mysql密码 :" password
	stty echo
	echo ""
	read -p "请输入mysql主机地址，不填则默认为localhost :" hostname
	read -p "请输入mysql端口，不填则默认为3306 :" port
	mysql_connect="${mysql_path} -u${username:=root} -p${password:=password} -h${hostname:=localhost} -P${port:=3306}"
	${mysql_connect} -e 'show databases' >/dev/null || { echo "连接失败" ;exit;}
}

list_table()
{
	clear
	mysql_db=$(${mysql_connect} -Ns -e 'show databases'|grep -E -v -w "information_schema|mysql|performance_schema")
	echo "请选择数据库:"
	select database in $mysql_db
	do
		break
	done
	echo "数据库:$database 中的数据表:"
	${mysql_connect} -D$database -e 'show tables'
}

show_session()
{
	${mysql_connect} -N -e "select id,user,host,db,command,time,state,info from information_schema.processlist where info not like '%information_schema.processlist%'"	
}

count_session()
{
	${mysql_connect} -e "select user,count(user) as count_session from information_schema.processlist group by user order by count_session desc"
}

check_privilege()
{
	${mysql_connect} -e "select host,user,Select_priv, Insert_priv, Update_priv, Delete_priv, Create_priv, Drop_priv from mysql.user"
}


select_fn()
{
	echo -e "\n请选择功能:"
	select fn in "显示数据表" "显示连接数列表" "连接数统计" "权限查询(需root账号)" "创建测试表" "删除测试表" "退出"
	do
		break
	done
	case $fn in
	显示数据表)
		list_table
		;;
	显示连接数列表)
		show_session
		;;
	连接数统计)
		count_session
		;;
	权限查询\(需root账号\))
		check_privilege
		;;
	创建测试表)
		create_table
		;;
	删除测试表)
		drop_table
		;;
	退出)
		exit
	esac
}

create_table()
{
	if [ -n "$database" ];then
		${mysql_connect} -D$database -e "CREATE TABLE $database.test_script_table (name varchar(15) NOT NULL,age int(15) NOT NULL, createTime datetime DEFAULT NULL,PRIMARY KEY (name)) ENGINE=InnoDB DEFAULT CHARSET=utf8;" && echo "测试表: test_script_table 已在 $database 库中创建成功,可使用\"显示数据表\"功能查看" || echo "创建测试表失败"
	else
		echo "请先选择\"显示数据表\"功能"
	fi
}

drop_table()
{
	if [ -n "$database" ];then
		${mysql_connect} -D$database -e "DROP TABLE $database.test_script_table" && echo "测试表: test_script_table 已从 $database 库中删除成功,可使用\"显示数据表\"功能查看" || echo "删除测试表失败"
	else
		echo "请先选择\"显示数据表\"功能"
	fi
}

mysql_path_check
input_info
while true
do
	select_fn
done
