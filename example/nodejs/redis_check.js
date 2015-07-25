var redis = require("redis");

//https://www.npmjs.com/package/redis
//https://github.com/NodeRedis/node_redis
// http://ourjs.com/detail/548d14be8a34fa3204000007
//var client = redis.createClient(6379,'127.0.0.1',{connect_timeout:1});
var client = redis.createClient(6379,'10.144.240.200',{connect_timeout:1}); //增加超时选项
 
client.on('error',function(error){
        console.log(error);
});

// 设置键值
client.set("Testing", "string val", redis.print);

// 取值
client.get("Testing", function(err, replies) {
    console.log(replies);
});

// 枚举趣出数据库中的所有键
client.keys('wxu*', function (err, keys) {
	for(var i = 0; i < keys.length; i ++){
		console.log("-- " + keys[i]);
		client.del(keys[i], redis.print);
	}
 
});