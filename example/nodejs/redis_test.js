/**
 * Created by Administrator on 2015/10/16.
 */

//  http://blog.csdn.net/leftfist/article/details/39995411

var redis = require("redis"),//召唤redis
/*
 连接redis数据库，createClient(port,host,options);
 如果REDIS在本机，端口又是默认，直接写createClient()即可
 redis.createClient() = redis.createClient(6379, '127.0.0.1', {})
 */
    client = redis.createClient(6379,'127.0.0.1',{});
//如果需要验证，还要进行验证
//client.auth(password, callback);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

//错误监听？
client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);//set "string key" "string val"
/*
 redis.print，回调函数，将redis的返回值显示出来。上一句执行结果，将返回“OK”
 */
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
//遍历哈希表"hash key"
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.hget("hash key","hashtest 1",redis.print);

    /*两种都可以断掉与redis的连接，
     end()很粗暴，不管3721，一下子退出来了，上面那句获取哈希表"hash key"的某个元素值的表达式将没有结果返回
     而quit()则是先将语句处理完毕再干净地退出，斯文得很
     */
//client.end();
    client.quit();
});