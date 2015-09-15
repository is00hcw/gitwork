var cp = require('child_process');
var restify = require('restify');
var request = require('superagent');
var path = require('path');
var os = require('os');
var fs = require('fs');
var ALY = require('aliyun-sdk');
var events = require("events");

var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
 
  //http://segmentfault.com/a/1190000000369308 
var ip_addr = '0.0.0.0';
var port    =  '6000';

var server = restify.createServer({
    name : "myapp"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.get({path : '/voice  ' } , voiceHandler);

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});  

function voiceHandler(req , res , next){
  res.setHeader('Access-Control-Allow-Origin','*');
  console.log(req.params);
  var token = req.params.token;
  var mediaId = req.params.mediaId;
  var ossFile = req.params.ossFile;
  console.log("token: " + token);
  console.log("mediaId: " + mediaId) ;
  
  var filepath = path.join(os.tmpDir(), mediaId +".png" );   //.amr
  var url = "http://file.api.weixin.qq.com/cgi-bin/media/get?media_id=" + mediaId + "&access_token=" + token;  //从微信服务器下载媒体
  console.log("path : " + filepath);
  console.log("url : " + url);
  request.get(url).on('end', function(response){
    console.log("end... " );
    var stat = fs.statSync(filepath);
    console.log("stat : " + stat.size);
    changeVoiceFormat({"filepath": filepath} , req, res, next);
    
  }).pipe(fs.createWriteStream(filepath));
  
//   res.send(200 , url);
}
  
  // http://www.infoq.com/cn/articles/yph-shell-meet-nodejs/
 var options = { 
    encoding: 'utf8',
    timeout: 0, /*子进程最长执行时间 */
    maxBuffer: 200*1024,  /*stdout和stderr的最大长度*/
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
  };
   
function changeVoiceFormat(ctx, req , res , next){
   var filepath = ctx["filepath"]; 
   var targetpath = path.join(os.tmpDir(), filepath.replace(".amr", ".mp3") );
   
   cp.exec('ffmpeg -i ' + filepath + ' ' + targetpath , options, function(err, stdout, stderr){   //amr转mp3
     console.log('stdout: ' + stdout);
     console.log('stderr: ' + stderr);
     postVoiceChanged({"targetpath":targetpath} , req, res, next);
  })
} 

function postVoiceChanged(ctx, req , res , next){
    var targetpath = ctx["targetpath"];
    cp.exec("ffmpeg -i " + targetpath + " 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//"  , options, function(err, stdout, stderr){   //读取MP3时长
     console.log('stdout: ' + stdout);
     console.log('stderr: ' + stderr);
     var parts = stdout.split(":");
     if(parts.length >= 3){
       ctx["mp3_len"] = parts[2];
     }else{
        ctx["mp3_len"] = "-1";
     }
     
     res.send(200 , stdout);
     return next();
    }) 
}
  
// 监听事件some_event
emitter.on("some_event", function(){
  console.log("事件触发，调用此回调函数");
});
setTimeout(function(){
  emitter.emit("some_event");   //触发事件some_event
},3000);

  
function rpcReq(req , res , next){
  request.get("http://qdapi.atsmart.io/v3/device/datetime").set("TOKEN","xxx").end(function(err, ret){
    if(ret.ok){
      console.log(ret.body);
      console.log(ret.text);
      res.send(200 , ret.body);
    }
  })
}

 