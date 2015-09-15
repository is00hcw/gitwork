var ALY = require('aliyun-sdk');
var path = require('path');
var os = require('os');
var fs = require('fs');
var events = require("events");

var emitter = new events.EventEmitter();//创建了事件监听器的一个对象

var oss = new ALY.OSS({
  "accessKeyId": "",
  "secretAccessKey": "",
  // 根据你的 oss 实例所在地区选择填入
  // 杭州：http://oss-cn-hangzhou.aliyuncs.com
  // 北京：http://oss-cn-beijing.aliyuncs.com
  // 青岛：http://oss-cn-qingdao.aliyuncs.com
  // 深圳：http://oss-cn-shenzhen.aliyuncs.com
  // 香港：http://oss-cn-hongkong.aliyuncs.com
  // 注意：如果你是在 ECS 上连接 OSS，可以使用内网地址，速度快，没有带宽限制。
  // 杭州：http://oss-cn-hangzhou-internal.aliyuncs.com
  // 北京：http://oss-cn-beijing-internal.aliyuncs.com
  // 青岛：http://oss-cn-qingdao-internal.aliyuncs.com
  // 深圳：http://oss-cn-shenzhen-internal.aliyuncs.com
  // 香港：http://oss-cn-hongkong-internal.aliyuncs.com
  endpoint: 'http://oss-cn-shenzhen.aliyuncs.com' , //'http://oss.atsmart.io',
  // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
  apiVersion: '2013-10-15'
});

var Bucket = 'atsmart-oss';

var filepath = "test.png";
console.log("try to upload :" + filepath)
/*
fs.readFile(filepath, function (err, data) {
  if (err) {
    console.log('error:', err);
    return;
  }

  oss.putObject({
      Bucket: Bucket,
      Key: filepath,                 // 注意, Key 的值不能以 / 开头, 否则会返回错误.
      Body: data,
      AccessControlAllowOrigin: '*',
      //ContentType: 'text/plain',
      CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
      ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
      //ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
      //ServerSideEncryption: 'AES256',
      //Expires: ''                       // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    },
    function (err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }

       console.log('success:', data);
    });
});

  */
oss.getObject({
    Bucket: Bucket,
    Key: filepath
  },
  function (err, data) {
    if (err) {
      console.log('error:', err);
      return;
    }
    console.log("data 2...");
    
   /* var fileWriteStream = fs.createWriteStream('down.png');
    fileWriteStream.write(data.Body);
    fileWriteStream.end();
     */
    fs.writeFileSync('down.png', data.Body);
    console.log('success:', data);
  });



// 监听事件some_event
emitter.on("some_event", function(){
  console.log("事件触发，调用此回调函数");
});
setTimeout(function(){
  emitter.emit("some_event");   //触发事件some_event
},3000);