var coap  = require('coap')
    , req   = coap.request({
                observe: true
              })

//统计触发response事件的次数
var resp_count = 0
req.on('response', function(res) {

     //输出响应结果
    res.pipe(process.stdout)
    resp_count++
    console.log('触发resp：' + resp_count)

    //统计触发data事件的次数
    var data_count = 0
    //每次收到服务器发来的observe响应时触发data事件
    res.on('data',function(data){

        data_count++
        console.log('触发data：' + data_count + '\n-------\n')
        
        //data事件次数达到3时关闭监听
        if(data_count === 3)
            res.close()
    })

})

req.end()