#!/bin/bash

###########################################################################
# Copyright 2014 Yottabyte
# Version: 20141124
###########################################################################
# trapping Control + C
# these statements must be the first statements in the script to trap the CTRL C event

trap 'logMsgToConfigSysLog "INFO" "Aborting the script."; exit 1' INT

###########################################################################
# name of the current script. This will get overwritten by the child script which calls this
SCRIPT_NAME="configure_linux_rsyslog.sh"
# version of the current script. This will get overwritten by the child script which calls this
SCRIPT_VERSION=1.0
# current timestamp
CUR_TIMESTAMP=$(date +%Y%m%d%H%M%S)

# directory location for syslog
RSYSLOG_CONF_DIR=/etc/rsyslog.d
# rsyslog meta data directory
RSYSLOG_DIR=/var/spool/rsyslog
# rsyslog service name
RSYSLOG_SERVICE=rsyslog
# rsyslogd
RSYSLOGD=rsyslogd
# minimum version of rsyslog
MIN_RSYSLOG_VERSION=5.8.0
# the users syslog version
RSYSLOG_VERSION=

# this variable will hold the host name
HOST_NAME=
# this variable will hold the name of the linux distribution
LINUX_DIST=

# remote syslog server host name, get from argv
#SYSLOG_SERVER_HOST=log.rizhiyi.com
# variables used in rsyslog conf file
SYSLOG_SERVER_PORT=5140
Rizhiyi_DISTRIBUTION_ID=32473

# Instruction link on how to configure rsyslog on linux manually.
# This will get overwritten by the child script which calls this
# on how to configure the child application
MANUAL_CONFIG_INSTRUCTION="Manual instructions to configure rsyslog on Linux are available at https://www.yottabyte.cn/docs/rsyslog-manual-configuration/"

# this variable will hold if the check env function for linux is invoked
LINUX_ENV_VALIDATED="false"

###########################################################################
logMsgToConfigSysLog()
{
  if [ $1 == "INFO" ]; then
    echo -e "\033[1;36m[$(date +"%Y-%m-%d %H:%M:%S")] $@\033[m" >&2
  elif [ $1 == "WARN" ]; then
    echo -e "\033[1;33m[$(date +"%Y-%m-%d %H:%M:%S")] $@\033[m" >&2
  elif [ $1 == "ERROR" ]; then
    echo -e "\033[1;31m[$(date +"%Y-%m-%d %H:%M:%S")] $@\033[m" >&2
  else
    echo -e "\033[1;36m[$(date +"%Y-%m-%d %H:%M:%S")] $@\033[m" >&2
  fi
}

# executing the script to install and configure rsyslog.
installRsyslogConfTemplate()
{
  # log message indicating starting of Rsyslog configuration
  logMsgToConfigSysLog "INFO" "Initiating Configure rsyslog for Linux."

  if [ "$LINUX_ENV_VALIDATED" == "false" ]; then
    checkLinuxRizhiyiCompatibility
  fi

  # create rsyslog dir if it doesn't exist, Modify the permission on rsyslog directory if exist on Ubuntu
  createRsyslogDir

  # if all the above check passes, write the rsyslog conf template file
  writeRsyslogConfFileTemplate
}

# check if the Linux environment is compatible with Yo.
# Also set few variables after the check.
checkLinuxRizhiyiCompatibility()
{
  # 1. check if the user has root permission to run this script
  checkIfUserHasRootPrivileges

  # 2. check if the OS is supported by the script. If no, then exit
  checkIfSupportedOS

  # 3. chekc if hostname is valid
  checkIfHostnameOK

  # 4. check if the romote log collector servers are accessible. If no, ask user to check network connectivity and exit
  checkIfYottabyteServersAccessible

  # 5. check if rsyslog is configured as service. If no, then exit
  checkIfRsyslogConfiguredAsService

  # 6. check for the minimum version of rsyslog i.e 5.8.0. If no, then exit
  checkIfMinVersionOfRsyslog

  # 7. check if selinux service is enforced. if yes, ask the user to manually disable and exit the script
  checkIfSelinuxServiceEnforced

  # 8. check if appname is duplicate
  checkIfAppnameIsDuplicate

  LINUX_ENV_VALIDATED="true"
}

# checks if user has root privileges
checkIfUserHasRootPrivileges()
{
  # This script needs to be run as a sudo user
  if [[ $EUID -ne 0 ]]; then
    logMsgToConfigSysLog "ERROR" "This script must be run with root privilege"
    exit 1
  else
    logMsgToConfigSysLog "INFO" "checkIfUserHasRootPrivileges is OK"
  fi
}

# check if supported operating system
checkIfSupportedOS()
{
  getOS

  LINUX_DIST_IN_LOWER_CASE=$(echo $LINUX_DIST | tr "[:upper:]" "[:lower:]")

  case "$LINUX_DIST_IN_LOWER_CASE" in
    *"ubuntu"* )
    logMsgToConfigSysLog "INFO" "Operating system is Ubuntu."
    ;;
    *"redhat"* )
    logMsgToConfigSysLog "INFO" "Operating system is Red Hat."
    ;;
    *"centos"* )
    logMsgToConfigSysLog "INFO" "Operating system is CentOS."
    ;;
    *"darwin"* )
    # if the OS is mac then exit
    logMsgToConfigSysLog "ERROR" "This script is for Linux systems, and Darwin or Mac OSX are not currently supported"
    logMsgToConfigSysLog "ERROR" "You can config rsyslog manually"
    exit 1
    ;;
    * )
    logMsgToConfigSysLog "WARN" "The linux distribution '$LINUX_DIST' has not been previously tested with Rizhiyi."
    while true; do
      read -p "Would you like to continue anyway? (yes/no)" yn
      case $yn in
        [Yy]* )
        break;;
        [Nn]* )
        exit 1
        ;;
        * ) echo "Please answer yes or no.";;
      esac
    done
    ;;
  esac

  logMsgToConfigSysLog "INFO" "CheckIfSupportedOS is OK"
}

# get platform and distribution information
getOS()
{
  # Determine OS platform
  UNAME=$(uname | tr "[:upper:]" "[:lower:]")
  # If Linux, try to determine specific distribution
  if [ "$UNAME" == "linux" ]; then
    # /etc/issue always exit (Ubuntu, Debian, CentOS, RHEL, Arch, OpenSUSE)
    if [ -f /etc/issue ]; then
      LINUX_DIST=$(head -n1 /etc/issue | cut -f 1 -d  " ")
    # If available, use LSB to identify distribution
    elif [ -f /etc/lsb-release -o -d /etc/lsb-release.d ]; then
      LINUX_DIST=$(lsb_release -i | cut -d: -f2 | sed s/'^\t'//)
    # If system-release is available, then try to identify the name
    elif [ -f /etc/system-release ]; then
      LINUX_DIST=$(cat /etc/system-release  | cut -f 1 -d  " ")
    # Otherwise, use release info file
    else
      LINUX_DIST=$(ls -d /etc/[A-Za-z]*[_-][rv]e[lr]* | grep -v "lsb" | cut -d'/' -f3 | cut -d'-' -f1 | cut -d'_' -f1)
    fi
  fi

  # For everything else (or if above failed), just use generic identifier
  if [ "$LINUX_DIST" == "" ]; then
    LINUX_DIST=$(uname)
  fi
}

# check $(hostname) is invalid or meanless
checkIfHostnameOK()
{
  HOSTNAME=$(hostname)
  IS_VALID_HOSTNAME="NO"
  if [ "x$HOSTNAME" == "x" ]; then
    logMsgToConfigSysLog "ERROR" "Bad Hostname [$HOSTNAME]"
  elif [ "$HOSTNAME" == "localhost" ]; then
    logMsgToConfigSysLog "ERROR" "Bad Hostname [$HOSTNAME]"
  elif [ "$HOSTNAME" == "127.0.0.1" ]; then
    logMsgToConfigSysLog "ERROR" "Bad Hostname [$HOSTNAME]"
  else
    IS_VALID_HOSTNAME="YES"
  fi

  if [ "$IS_VALID_HOSTNAME" == "NO" ]; then
    logMsgToConfigSysLog "ERROR" "Please Config Your Hostname First"
    exit 1
  fi
}

# checks if all the various endpoints used for configuring are accessible
checkIfYottabyteServersAccessible()
{
  logMsgToConfigSysLog "INFO" "Checking if SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is reachable."
  if [ $(ping -c 1 $SYSLOG_SERVER_HOST | grep "1 packets transmitted, 1 received, 0% packet loss" | wc -l) == 1 ]; then
    logMsgToConfigSysLog "INFO" "SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is reachable."
  else
    logMsgToConfigSysLog "ERROR" "SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is not reachable. Please check your network and firewall settings. Continuing to configure Rizhiyi on your system."
    exit 1
  fi

  logMsgToConfigSysLog "INFO" "Checking if SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is reachable via $SYSLOG_SERVER_PORT port"
  if [ $(which curl | wc -l) == 0 ]; then
    logMsgToConfigSysLog "ERROR" "We need \"curl\" to check if SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is reachable, but it's not found"
    exit 1
  fi

  if [ $(curl --connect-timeout 10 $SYSLOG_SERVER_HOST:$SYSLOG_SERVER_PORT 2>&1 | grep "Empty reply from server" | wc -l) == 1 ]; then
    logMsgToConfigSysLog "INFO" "SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is reachable via $SYSLOG_SERVER_PORT port."
  else
    logMsgToConfigSysLog "ERROR" "SYSLOG_SERVER_HOST $SYSLOG_SERVER_HOST is not reachable via $SYSLOG_SERVER_PORT port. Please check your network and firewall settings. Continuing to configure Rizhiyi on your system."
    exit 1
  fi
}

# check if rsyslog is configured as service. If it is configured as service and not started, start the service
checkIfRsyslogConfiguredAsService()
{
  if [ -f /etc/init.d/$RSYSLOG_SERVICE ]; then
    logMsgToConfigSysLog "INFO" "$RSYSLOG_SERVICE is present as service."
  else
    logMsgToConfigSysLog "ERROR" "$RSYSLOG_SERVICE is not present as service."
    exit 1
  fi

  if [ $(ps -ef | grep -v grep | grep "$RSYSLOG_SERVICE" | wc -l) -eq 0 ]; then
    logMsgToConfigSysLog "INFO" "$RSYSLOG_SERVICE is not running. Attempting to start service."
    sudo service $RSYSLOG_SERVICE start
  fi
}

# compares two version numbers, used for comparing versions of various softwares
compareVersions ()
{
  typeset    IFS='.'
  typeset -a v1=( $1 )
  typeset -a v2=( $2 )
  typeset    n diff

  for (( n=0; n<$3; n+=1 )); do
  diff=$((v1[n]-v2[n]))
  if [ $diff -ne 0 ] ; then
    [ $diff -le 0 ] && echo '-1' || echo '1'
    return
  fi
  done
  echo  '0'
}

# check if mimimum version of rsyslog required to configure is met
checkIfMinVersionOfRsyslog()
{
  RSYSLOG_VERSION=$(sudo $RSYSLOGD -version | grep "$RSYSLOGD")
  RSYSLOG_VERSION=${RSYSLOG_VERSION#* }
  RSYSLOG_VERSION=${RSYSLOG_VERSION%,*}
  RSYSLOG_VERSION=$RSYSLOG_VERSION | tr -d " "
  if [ $(compareVersions $RSYSLOG_VERSION $MIN_RSYSLOG_VERSION 3) -lt 0 ]; then
    logMsgToConfigSysLog "ERROR" "Min rsyslog version required is ${MIN_RSYSLOG_VERSION}"
    exit 1
  fi
}

# check if SeLinux service is enforced
checkIfSelinuxServiceEnforced()
{
  isSelinuxInstalled=$(getenforce -ds 2>/dev/null)
  if [ $? -ne 0 ]; then
    logMsgToConfigSysLog "INFO" "selinux status is not enforced."
  elif [ $(sudo getenforce | grep "Enforcing" | wc -l) -gt 0 ]; then
    logMsgToConfigSysLog "ERROR" "selinux status is 'Enforcing'. Please disable it and start the rsyslog daemon manually."
    exit 1
  fi
}

# check if appname is duplicate
checkIfAppnameIsDuplicate()
{
  if [ $(grep -E '^\$InputFileTag' ${RSYSLOG_CONF_DIR}/*.conf 2>/dev/null | awk '{print $NF}' | grep "${APPNAME}" | wc -l) -gt 0 ]; then
    logMsgToConfigSysLog "ERROR" "Appname \"${APPNAME}\" exist in ${RSYSLOG_CONF_DIR}, visit https://www.rizhiyi.com/docs/upload/setrsyslog.html for more information"
    exit 1
  fi
}

# create /var/spool/rsyslog directory if not already present. Modify the permission of this directory for Ubuntu
createRsyslogDir()
{
  if [ -d "$RSYSLOG_DIR" ]; then
    logMsgToConfigSysLog "INFO" "\"$RSYSLOG_DIR\" already exist."
    if [[ "$LINUX_DIST" == *"Ubuntu"* ]]; then
      logMsgToConfigSysLog "INFO" "Changing the permission on the rsyslog in \"/var/spool\""
      sudo chown -R syslog:adm $RSYSLOG_DIR
    fi
  else
    logMsgToConfigSysLog "INFO" "Creating directory \"$RSYSLOG_DIR\""
    sudo mkdir -v $RSYSLOG_DIR
    if [[ "$LINUX_DIST" == *"Ubuntu"* ]]; then
      sudo chown -R syslog:adm $RSYSLOG_DIR
    fi
  fi
}

# write rsyslog conf file template to current directory
writeRsyslogConfFileTemplate()
{
  RSYSLOG_CONFFILE="${CUR_TIMESTAMP}_rizhiyi.conf"

  logMsgToConfigSysLog "INFO" "Creating rsyslog config file \"$RSYSLOG_CONFFILE\""
  echo > $RSYSLOG_CONFFILE
  chmod o+w $RSYSLOG_CONFFILE

  imfileStr="# Config Start
\$ModLoad imfile
\$WorkDirectory $RSYSLOG_DIR
"
  if [[ "$LINUX_DIST" == *"Ubuntu"* ]]; then
    imfileStr+="\$PrivDropToGroup adm
"
  fi

  imfileStr+="
\$InputFileName ${FILEPATH}
\$InputFileTag ${APPNAME}
\$InputFileStateFile stat-${CUR_TIMESTAMP}-${APPNAME}
\$InputFileSeverity info
\$InputFilePersistStateInterval 20000
\$RepeatedMsgReduction off
\$InputRunFileMonitor

\$InputFilePollInterval 3
\$template RizhiyiFormat_${APPNAME},\"<%pri%>%protocol-version% %timestamp:::date-rfc3339% %HOSTNAME% %app-name% %procid% %msgid% [${AUTH_TOKEN}@${Rizhiyi_DISTRIBUTION_ID} tag=\\\"${TAG}\\\"] %msg%\n\"

# Send message to Rizhiyi and discard it
if \$programname == '${APPNAME}' then @@${SYSLOG_SERVER_HOST}:${SYSLOG_SERVER_PORT};RizhiyiFormat_${APPNAME}
if \$programname == '${APPNAME}' then ~
# Config End"

  # write to config file
  cat << EOIPFW > $RSYSLOG_CONFFILE
$imfileStr
EOIPFW

  logMsgToConfigSysLog "INFO" "Created rsyslog config file \"$RSYSLOG_CONFFILE\""
  logMsgToConfigSysLog "INFO" "Moving the config file \"$RSYSLOG_CONFFILE\" to \"${RSYSLOG_CONF_DIR}\""
  mv -f $RSYSLOG_CONFFILE ${RSYSLOG_CONF_DIR}
  logMsgToConfigSysLog "INFO" "All done, please run \"service rsyslog restart\" to restart rsyslog service"
}

#
usage()
{
  echo -e "Usage:\n$0 -h rizhiyi_syslog_server_address -t your_token --filepath /path/to/your/logfile --appname type_of_your_log --tag \"custom_attributes_of_your_log\""
  echo
}

############################ MAIN ################################

if [ $# -eq 0 ]; then
  usage
  exit
fi

while [ "$1" != "" ]; do
  case $1 in
    -h | --host ) shift
     SYSLOG_SERVER_HOST=$1
     ;;
    -t | --token ) shift
     AUTH_TOKEN=$1
     ;;
    --filepath ) shift
     FILEPATH=$1
     ;;
    --appname ) shift
     APPNAME=$1
     ;;
    --tag ) shift
     TAG=$1
     ;;
    -h | --help)
      usage
      exit
      ;;
  esac
  shift
done

# check input
if [ "x${SYSLOG_SERVER_HOST}" == "x" -o "x${AUTH_TOKEN}" == "x" -o "x${APPNAME}" == "x" -o "x${FILEPATH}" == "x" -o "x${TAG}" == "x" ]; then
  usage
  exit
else
  logMsgToConfigSysLog "INFO" "SYSLOG_SERVER_HOST:${SYSLOG_SERVER_HOST}, AUTH_TOKEN:${AUTH_TOKEN}, FILEPATH:${FILEPATH}, APPNAME:${APPNAME}, TAG:${TAG}"
fi

installRsyslogConfTemplate
