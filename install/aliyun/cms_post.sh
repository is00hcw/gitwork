#!/bin/bash
#########################################
#Usage:       sh cms_post.sh
#Author:      CMS Dev Team
#Company:     Aliyun Inc.
#Version:     1.0
#########################################

#parameters instructions
# $1: ali_uid, $2: metric_name, $3: metric_value, $4:fields

#convert current time to milliseconds

if [[ ! "$#" -eq 4 ]];then
	echo "usage: $0 userId, metricName, value, dimensions"
	echo "	--multiple dimensions like 'ip=111.111.111.111,hostname=cms'"
	exit 1
fi

#biz time
timestamp=`date +%s%N | cut -b1-13`

#build dimensions json
arr=(${4//,/ })
dimensions="{"
for i in "${arr[@]}"; do
	kv=(${i//=/ })
    dimensions=${dimensions}'"'${kv[0]}'":"'${kv[1]}'",'
done
dimensions=${dimensions%,*}
dimensions=${dimensions}'}'


#build namespace and metrics
userId="$1"
namespace="acs/custom/$1"
metrics='[{"metricName":"'"$2"'","value":'"$3"',"unit":"None","timestamp":'"$timestamp"',"dimensions":'"$dimensions"'}]'

url="http://open.cms.aliyun.com/metrics/put"
params="userId=$userId&namespace=$namespace&metrics=$metrics"

echo "params: ${params}"
curl -v ${url} --data ${params}
