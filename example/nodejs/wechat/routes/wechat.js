var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');
var jsonfile = require('jsonfile');
var fs= require('fs');

var appConfig = jsonfile.readFileSync('./config.json');
console.dir(appConfig);

var api = new WechatAPI(appConfig.appid, appConfig.appsecret);
  
// 微信授权和回调
var client = new OAuth(appConfig.appid, appConfig.appsecret, function (openid, callback) {
  // 传入一个根据openid获取对应的全局token的方法
  // 在getUser时会通过该方法来获取token
  fs.readFile(openid +':access_token.txt', 'utf8', function (err, txt) {
    if (err) {return callback(err);}
    callback(null, JSON.parse(txt));
  });
}, function (openid, token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  // 持久化时请注意，每个openid都对应一个唯一的token!
  fs.writeFile(openid + ':access_token.txt', JSON.stringify(token), callback);
});

// 主页,主要是负责OAuth认真
router.get('/test', function (req, res) {
  var code = req.query.code;
  console.log("code: ", code);
  if (!code) {
    var url = client.getAuthorizeURL('http://qdapp.atsmart.io/node/wechat/test', 'snsapi_userinfo');
    res.redirect(url)
    return;
  }
  console.log('----weixin callback -----')

  client.getAccessToken(code, function (err, result) {
    console.dir(err)
    console.dir(result)
    var accessToken = result.data.access_token;
    var openid = result.data.openid;

    console.log('token=' + accessToken);
    console.log('openid=' + openid);
    //req.session.openid = openid;
    
    res.redirect('/node/wechat/hello?openid=' + openid);
  });
 
})

router.get("/hello", function(req, res){
  console.log("hello " + req.query.openid)
  //res.send('hello  ' + req.query.openid);
  console.log("url " ,   'http://qdapp.atsmart.io'  + req.originalUrl )
  api.getJsConfig({
    url: 'http://qdapp.atsmart.io'  + req.originalUrl 
  }, function(err, result){
    if(err){
      return console.log(err);
    }
    res.render('wechat', {
      "title": "WiFi配置",
      "config": result
    });
  });

})

module.exports = router;

