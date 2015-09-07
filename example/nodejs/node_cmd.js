var cp = require('child_process');
var restify = require('restify');
var request = require('superagent');

 // http://www.infoq.com/cn/articles/yph-shell-meet-nodejs/
 var options = { 
    encoding: 'utf8',
    timeout: 0, /*子进程最长执行时间 */
    maxBuffer: 200*1024,  /*stdout和stderr的最大长度*/
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
  };
  
   
  //http://segmentfault.com/a/1190000000369308 
var ip_addr = '0.0.0.0';
var port    =  '6000';

var server = restify.createServer({
    name : "myapp"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var PATH = '/exec'
server.get({path : PATH } , execJob);
server.get({path : '/rpc  ' } , rpcReq);

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});  

function execJob(req , res , next){
  res.setHeader('Access-Control-Allow-Origin','*');
   //exec
  cp.exec('ls -lh /usr'/*command*/,{}/*options, [optiona]l*/, function(err, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
     
     res.send(200 , stdout);
     return next();
  })
}
  
function rpcReq(req , res , next){
  request.get("http://qdapi.atsmart.io/v3/device/datetime").set("TOKEN","xxx").end(function(err, ret){
    if(ret.ok){
      console.log(ret.body);
      console.log(ret.text);
      res.send(200 , ret.body);
    }
  })
}

var start = Date.now();
console.log('开始行走江湖,当前时间:' + start);
setTimeout(function () {
    console.log(Date.now() - start + '毫秒后,突然杀出一位好汉!\r\n');
}, 2000);