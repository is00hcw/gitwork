const coap    = require('coap')
    , server  = coap.createServer()

server.on('request', function(req, res) {
    
    //判断是否是Observe请求
    if (req.headers['Observe'] !== 0)
        return res.end(new Date().toISOString() + '\n')

    //定时将日期写入ObserveWriteStream
    var count = 0
    var interval = setInterval(function() {
        count++
        res.write(new Date().toISOString() + '\n')
        
        if (count === 3) {
            clearInterval(interval)
            //结束观察模式
            res.end()
        }
    }, 1000)

    //结束观察模式后触发finish事件
    res.on('finish', function(err) {
        console.log('finsh')
    })

})

server.listen(function() {
    console.log('server started')
})