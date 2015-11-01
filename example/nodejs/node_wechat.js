var cp = require('child_process');
var restify = require('restify');
var request = require('superagent');
var path = require('path');
var os = require('os');
var fs = require('fs');
var ALY = require('aliyun-sdk');
var events = require("events");
var moment = require('moment');
//var config = JSON.parse(fs.readFileSync('./config.json','utf-8'))
var config = require('./config.json')
var log4js = require("log4js");
var log4js_config = require("./log4js.json");  //log配置
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file');

function debug(str) {
  logger.debug(str);
  console.log(str);
}
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象

var Bucket = config.Bucket;
var oss = new ALY.OSS({
  "accessKeyId": config.accessKeyId ,
  "secretAccessKey": config.secretAccessKey ,
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
  endpoint: 'http://oss-cn-shenzhen.aliyuncs.com',  
  // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
  apiVersion: '2013-10-15'
});


 
//http://segmentfault.com/a/1190000000369308 
var ip_addr = config.ip_addr ;
var port = '9000';

var server = restify.createServer({
  name: "node api server"
});

server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());

server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
//server.get(/\/docs\/public\/?.*/, restify.serveStatic({
//  directory: './public'
//}));
//server.use(restify.throttle({
//  burst: 100,
//  rate: 50,
//  ip: true,
//  overrides: {
//    '192.168.1.1': {
//      rate: 0,        // unlimited
//      burst: 0
//    }
//  }
//}));
//server.use(function setETag(req, res, next) {
//  res.header('ETag', 'myETag');
//  res.header('Last-Modified', new Date());
//});
//server.use(restify.conditionalRequest());

server.get({ path: '/voice' }, voiceHandler);

server.listen(port, ip_addr, function () {
  console.log('%s listening at %s ', server.name, server.url);
});

function voiceHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // console.log(req.params);
  var startTime = new Date().getTime();  // 请求开始时间
  var wechat_token = req.params.wechat_token;
  var mediaId = req.params.mediaId;
  var did = req.params.did;
  debug("startTime: " + startTime);
  debug("wechat token: " + wechat_token);
  debug("mediaId: " + mediaId);
  
  // 下载 amr
  var filepath = path.join(os.tmpDir(), mediaId + ".amr");   //.amr
  var url = "http://file.api.weixin.qq.com/cgi-bin/media/get?media_id=" + mediaId + "&access_token=" + wechat_token;  //从微信服务器下载媒体
  debug("download url : " + url);
  debug("save path : " + filepath);
  request.get(url).on('end', function (response) {
	var duration = new Date().getTime() - startTime;
	debug("download wechat time: " + duration)
    var stat = fs.statSync(filepath);
    console.log("save file stat : " + stat.size);
    
   // amr2mp3(req, res, next ,{ "filepath": filepath , "startTime": startTime  });
    ffpmeg(req, res, next ,{ "filepath": filepath , "startTime": startTime  });
  }).pipe(fs.createWriteStream(filepath));
  //   res.send(200 , url);
}
  
// http://www.infoq.com/cn/articles/yph-shell-meet-nodejs/
var options = {
  encoding: 'utf8',
  timeout: 5000, /*子进程最长执行时间 */
  maxBuffer: 200 * 1024,  /*stdout和stderr的最大长度*/
  killSignal: 'SIGTERM',
  cwd: null,
  env: null
};

function ffpmeg( req, res, next , ctx) {
	  var filepath = ctx["filepath"];
	  var targetpath = filepath.replace(".amr", ".mp3"); // path.join(os.tmpDir(), filepath.replace(".amr", ".mp3") );
	  var start = +new Date();
	  console.log("amr2mp3 :" + filepath)
	  var cmd1 = 'ffmpeg -y -xerror -i ' + filepath + ' ' + targetpath +  ' >/dev/null 2>/dev/null ';
	  var cmd2 = 'ls ' + targetpath ;
	  var cmd3 = "ffmpeg -i " + targetpath + " 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//";
	  var cmd = cmd1 + " ; " + cmd2 +" && " + cmd3;
	  debug("combine cmd : " + cmd)
	   cp.exec(cmd, options, function (err, stdout, stderr) {    
			var duration = new Date().getTime() - ctx["startTime"] ;
			debug("ffpmeg time: " + duration)
		    if (err) {
		      return next(err);
		    }
			debug('ffpmeg stdout: ' + stdout);
		    debug('ffpmeg stderr: ' + stderr);
			if(stdout.indexOf("No such file") > -1){
				return next(err);
			}
		    ctx["targetpath"] = targetpath
		    
			var parts = stdout.split(":");
		    if (parts.length >= 3) {
		      ctx["mp3_len"] = parseFloat(parts[2].trim()).toFixed(0);
		      debug("mp3_len : " + ctx["mp3_len"])
		    } else {
		      ctx["mp3_len"] = -1;
		    }
		    uploadOss(req, res, next , ctx);
		
	  })
}

// amr 转mp3格式
function amr2mp3( req, res, next , ctx) {
  var filepath = ctx["filepath"];
  var targetpath = filepath.replace(".amr", ".mp3"); // path.join(os.tmpDir(), filepath.replace(".amr", ".mp3") );
  console.log("amr2mp3 :" + filepath)
  var cmd = 'ffmpeg -y -xerror -i ' + filepath + ' ' + targetpath;
  debug("convert cmd : " + cmd)
  cp.exec(cmd, options, function (err, stdout, stderr) {   //amr转mp3
	var duration = new Date().getTime() - ctx["startTime"] ;
	debug("amr2mp3 time: " + duration)
    if (err) {
      return next(err);
    }
    // console.log('amr2mp3 stdout: ' + stdout);
    // console.log('amr2mp3 stderr: ' + stderr);
    var stat = fs.statSync(targetpath);
    console.log(targetpath + " file stat : " + stat.size);
    ctx["targetpath"] = targetpath
    getMp3Len(req, res, next, ctx);
  })
}

function getMp3Len( req, res, next , ctx) {
  var targetpath = ctx["targetpath"];
  var cmd = "ffmpeg -i " + targetpath + " 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//";
  console.log("get mp3 len cmd: " + cmd)
  cp.exec(cmd, options, function (err, stdout, stderr) {   //读取MP3时长
	var duration = new Date().getTime() - ctx["startTime"] ;
	debug("getMp3Len time: " + duration)
    debug('getMp3Len stdout: ' + stdout);
    debug('getMp3Len stderr: ' + stderr);
    if (err) {
      return next(err);
    }
    var parts = stdout.split(":");
    if (parts.length >= 3) {
      ctx["mp3_len"] = parseFloat(parts[2].trim()).toFixed(0);
      debug("mp3_len : " + ctx["mp3_len"])
    } else {
      ctx["mp3_len"] = -1;
    }
    uploadOss(req, res, next , ctx);
  })
}

function uploadOss(req, res, next , ctx) {
  var filepath = ctx["filepath"];  // amr
  var targetpath = ctx["targetpath"];  // mp3
  var filename = path.basename(targetpath);

  var start = +new Date();
  fs.readFile(targetpath, function (err, data) {
    if (err) {
      debug('readFile error:' + err);
      return next(err);
    }

    oss.putObject({
      Bucket: Bucket,
      Key: filename,                 // 注意, Key 的值不能以 / 开头, 否则会返回错误.
      Body: data,
      AccessControlAllowOrigin: '*',
      CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
      //ContentType: 'text/plain',
      //ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
      //ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
      //ServerSideEncryption: 'AES256',
      //Expires: ''                       // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    },

      function (err, data) {
    	var duration = new Date().getTime() - ctx["startTime"] ;
    	debug("uploadOss time: " + duration)
        if (err) {
          debug('oss putObject error:' + err);
          return next(err);
        }
        var end = +new Date();
        debug("oss upload " + filename + " time: " + (end - start))
        debug('oss ret:' + JSON.stringify(data));
        //delete file 
       // fs.unlink(filepath )
       // fs.unlink(targetpath )
        
        var url = oss.getSignedUrl('getObject', {
          Bucket: Bucket,
          Key: filename,
          Expires: 3600 * 1000
        });
        url = url.replace("atsmart-oss.oss-cn-shenzhen.aliyuncs.com", config.endpoint ).split("?")[0];
        debug("original :" + url)
        debug("short url : " + url);
        ctx["oss_url"] = url;

        saveVoiceHistory(req, res, next, ctx);
        //        emitter.emit("upload_done", ctx);
      });
  });
    
  //  // 监听事件 
  //  emitter.on("upload_done", function (data) {
  //    console.log("事件触发，调用此回调函数 " + JSON.stringify(data));
  //    var json = JSON.stringify(ctx)
  //    console.log("+++return : " + json);
  //    logger.debug("req " + filepath + " resp " + json)
  //    res.send(200, json);
  //    return next();
  //  });
}

//setTimeout(function () {
//  emitter.emit("some_event");   //触发事件some_event
//}, 3000);

function saveVoiceHistory(req, res, next, ctx) {
  var did = req.params.did;
  var openid = req.params.openid;
  var uid = req.params.uid;
  var api_token = req.params.api_token;
  var ossRet = ctx["oss_url"]
  var len = ctx["mp3_len"]
  var url = config.voiceHistory  + uid;
  debug("--saveVoiceHistory " + "openid: " + openid + " uid: " + uid + " did: " + did + " api_token: " + api_token)

  var data = "[{\"id\":\"" + did + "\",\"data\":{\"resUrl\":\"" + ossRet
    + "\",\"createTime\":\"" + moment().format("YYYY-MM-DD HH:mm:ss") + "\",\"duration\":" + len + "}}]"
  var msg = '{"cmd":"NodeCreate","data":' + data + '}';
  debug("--saveVoiceHistory url: " + url + "  body: " + msg);
  request.post(url).send(JSON.parse(msg)).timeout(5000).set('Accept', 'application/json').set("Connection", "close").set("TOKEN", api_token).end(function (err, ret) {
	var duration = new Date().getTime() - ctx["startTime"] ;
    debug("saveVoiceHistory time: " + duration)
	debug("saveVoiceHistory ret: " + JSON.stringify(ret.body));
    if (err) {
      debug('saveVoiceHistory error:' + err);
    		return next(err);
    }
    pushDevice(req, res, next, ctx);
  })
}

function pushDevice(req, res, next, ctx) {
  var mediaId = req.params.mediaId;
  var did = req.params.did;
  var openid = req.params.openid;
  var uid = req.params.uid;
  var api_token = req.params.api_token;
  debug("--pushDevice " + "openid: " + openid + " uid: " + uid + " did: " + did + " api_token: " + api_token)
  var ossRet = ctx["oss_url"]  // || 'http://oss.atsmart.io/M700/D921/F91E/0F55/24B6/1446014424441.mp3';
  var len = ctx["mp3_len"] //|| 2;
  var data = "{\"timestamp\":" + new Date().getTime() + ",\"resUrl\":\"" + ossRet
    + "\",\"duration\":" + len + ",\"resMsg\":\"\",\"from\":\"" + uid
    + "\",\"resType\":\"voice\"}";
  var msg = '{"msgId" : "0","magic" : "0","msgOrder" : "0","cmd" : "PushResource","data" :' + data + '}';

  var url = config.pub2dev + '?UID=' + uid + '&DID=' + did + '&PID=M700';
  debug("push_url : " + url + " ,body: " + msg);
  request.put(url).send(JSON.parse(msg)).timeout(5000).set('Accept', 'application/json').set("Connection", "close").set("UTOKEN", api_token).set("DTOKEN", api_token).end(function (err, ret) {
	var duration = new Date().getTime() - ctx["startTime"] ;
	debug("pushDevice time: " + duration)
	debug("push_ret " + JSON.stringify(ret.body));
    if (err) {
      debug('push error:' + err);
    		return next(err);
    }
    var content = { "resUrl": ossRet, "duration": len };
    res.send(200, content);
    return next();
  })
	
  //	var token = "xxx";
  //	 request.get("http://xxxx").timeout(5000).set("Connection","close").set("UTOKEN", "xxx").end(function (err, ret) {
  //	    if (ret.ok) {
  //	      console.log(ret.body);
  //	      console.log(ret.text);
  //	      res.send(200, ret.body);
  //	    }
  //	 })
}

 