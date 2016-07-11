#!/bin/bash

declare -a error
WEB_URL=("http://app-web1:8080/app/m5/" "http://app-web2:8080/app/m5/" "http://app-web1:8080/app/m7/" "http://app-web2:8080/app/m7/" "http://app-web1:8080/app/gateway/" "http://app-web2:8080/app/gateway/")
FAIL_RETRY_COUNT=4
SLEEP_TIME=20

http_code() 
{
 # echo "HTTP_CODE: $URL ..."
  ALIVE=$(curl -m 10 --connect-timeout 10 -o /dev/null -s -w %{http_code} $URL)
}


# check url
for((i=0; i!=${#WEB_URL[@]}; ++i))
{
    echo "check url: ${WEB_URL[i]}"
    #ALIVE=`curl -o /dev/null -s -w %{http_code} -m 10 --connect-timeout 10 ${WEB_URL[i]}`
    URL=${WEB_URL[i]}
    http_code
    if [ "$ALIVE" = "200" ]; then
        echo "OK url: ${WEB_URL[i]}"
    else
 
       check_failed=1
       for((j=1;j<="$FAIL_RETRY_COUNT";j++));do 
            sleep $SLEEP_TIME 
            check_date=$(date '+ %F %T') 
            http_code
            echo "RETRY url: $URL  $ALIVE $check_date"
            if [ "$ALIVE" != "200" ]; then
                ((check_failed++)) 
            fi            
       done 

       if [ $check_failed -gt $FAIL_RETRY_COUNT ] ; then
         echo "FIND ERROR URL: ${WEB_URL[i]}"
         error+=("ERROR URL: ${WEB_URL[i]}")
       fi
    fi
}

# send result if error

echo "${#error[@]} errors"
if [ ${#error[@]} -gt 0 ] ; then
    msg=${error[@]}
   
    #data=`printf "%s%s%s" '{ "app": "674579f5-be5b-29c9-879d-649f6436c483", "eventId": "wechat_app", "eventType": "trigger", "alarmName": "'  ${msg}   '", "priority": 3 }' `
    s1='{ "app": "674579f5-be5b-29c9-879d-649f6436c483", "eventId": "wechat_app", "eventType": "trigger", "alarmName": "'
    s2='", "priority": 3 }'
    data=${s1}${msg}${s2}
    echo "send error mail: $data"
    curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d "$data" "http://api.110monitor.com/alert/api/event"
fi