var WechatAPI = require('wechat-api');
var OAuth = require('wechat-oauth');
var config = require('./config');
var fs = require("fs");
var restify = require('restify');

//微信授权和回调
var oauth_api = new OAuth(config.wechat.id, config.wechat.secret, function(openid,
		callback) {
	// 传入一个根据openid获取对应的全局token的方法
	// 在getUser时会通过该方法来获取token
	fs.readFile('tokens/' + openid + ':access_token.txt', 'utf8', function(err, txt) {
		if (err) {
			return callback(err);
		}
		callback(null, JSON.parse(txt));
	});
},
		function(openid, token, callback) {
			// 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
			// 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
			// 持久化时请注意，每个openid都对应一个唯一的token!
			fs.writeFile('tokens/' +  openid + ':access_token.txt', JSON.stringify(token),
					callback);
		});

var api = new WechatAPI(config.wechat.id, config.wechat.secret)/*, function (callback) {
  // 传入一个获取全局token的方法
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    if (err) {return callback(err);}
    callback(null, JSON.parse(txt));
  });
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
	console.log(token);
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
}); */

var redis_client = null;
exports.init = function(redisc) {
	redis_client = redisc;
	/** ticket缓存到redis  */
	api.registerTicketHandle(getTicketToken, saveTicketToken);

	//getTicketToken
	function getTicketToken(type, callback) {
		//取值
		redis_client.get("weixin_ticketToken", function(err, replies) {
			console.log(replies);
			if (err)
				return callback(err);
			callback(null, JSON.parse(replies));
		});
	}
	//saveTicketToken
	function saveTicketToken(type, ticketToken, callback) {
		console.log(ticketToken);
		redis_client.set("weixin_ticketToken", JSON.stringify(ticketToken),
				function(err, result) {
					if (err)
						return callback(err);
					callback(null);
				});
	}
	console.log("wechat init");
}

exports.getJsConfig = function(url, callback) {
	var param = {
		"url" : url
	};
	console.log("param ==" + JSON.stringify(param));
	api.getJsConfig(param, callback);
}

exports.getUserInfo = function(openid, callback) {
	api.getUser(openid, callback);
}

exports.oauthUrl = function(url, req, res, next){
	var code = req.query.code;
	console.log("code: ", code);
	if (!code) {
	    var new_url = oauth_api.getAuthorizeURL(url, 'state', 'snsapi_userinfo');
		console.log("redirect: ", new_url);
	    return res.redirect(new_url, next);
	}
	var cookies = req.cookies;
	 console.log('----weixin callback -----' + code  );
	  
	 
	 oauth_api.getAccessToken(code, function (err, result) {
	  
	    console.dir(result)
	    var accessToken = result.data.access_token;
	    var openid = result.data.openid;		
	   
	   	cacheUserInfo(openid, accessToken);
		
		 
		 var val = 'Hi ' + Math.random();
		// console.log(val + "\n");
		 res.setCookie('rand',  val); 
		 res.setCookie('openid', openid);
		// res.json(result.data);
		return next( );
	 });
}

var wx_client = restify.createJsonClient({
  url: 'https://api.weixin.qq.com/'
});


function cacheUserInfo(openid, accessToken){
	 // http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
 	var reqUrl = "https://api.weixin.qq.com/sns/userinfo?access_token="+ accessToken +"&openid="+ openid + "&lang=zh_CN";
	console.log(reqUrl);
		
	wx_client.get("/sns/userinfo?access_token="+ accessToken +"&openid="+ openid + "&lang=zh_CN", function (err, req, res, obj) {
		if(!err){
			console.log('cacheUserInfo: %j', obj);
			redis_client.set("ec_" + openid,  JSON.stringify(obj), function(err2, replies) {
				if(!err2)
					console.log("cache " + "ec_" + openid)
				else
					console.log("err :" + err2)
			});
		}
	});
}

exports.SendText=function(openid, text, callback){
	 api.sendText(openid, text, function(err, result) { 
		callback(err, result)
	});
}

exports.sendTemplate=function(openid,templateId,url,data, callback){
	// var data = {
	// 		"first": {
	// 			"value":"恭喜你购买成功！",
	// 			"color":"#173177"
	// 		} ,
	// 		"remark":{
	// 			"value":"欢迎再次购买！",
	// 			"color":"#173177"
	// 		}
	// };
	api.sendTemplate(openid, templateId, url, data, callback);
}

///---------------
exports.testSendText=function(openid){
	// 'oAo6us5HDbDKByyadpMEAHf2NVw4'
	 console.log(openid);
	 api.sendText(openid, 'Hello world', function(err, result) { 
		if(err)
		console.log("send err:" + err)
		else
		console.log("after send:" + JSON.stringify(arguments));
	});
}
 
 
/*
wx.getUserInfo('oAo6us5HDbDKByyadpMEAHf2NVw4', function(err,result){
    console.log(result);
    console.log(result.openid);
    console.log(result.nickname);
    console.log(result.headimgurl);
}) */

/*
 var param = {
	 // jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
	 url: 'http://www.xxx.com'
 };
 api.getJsConfig(param, function(err,result){
 console.log("jsconfig:" + JSON.stringify(result));
 });

 fs.readFile('menu.txt', 'utf8', function (err, txt) {
     console.log("read file:--" + txt);
     api.createMenu(JSON.parse(txt), function(err, result){
       console.log("create_menu:" + JSON.stringify(result)) ;
       getWechatMenu();
     });
 });
*/

function getWechatMenu() {
	api.getMenu(function(err, result) {
		console.log("get menu:---" + JSON.stringify(result));
		// fs.writeFile('menu.txt', JSON.stringify(result), null);
	});
}

function template_test() {
	var templateId = '模板id';
	//URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
	var url = 'http://weixin.qq.com/download';
	var data = {
		"first" : {
			"value" : "恭喜你购买成功！",
			"color" : "#173177"
		},
		"keyword1" : {
			"value" : "巧克力",
			"color" : "#173177"
		},

		"remark" : {
			"value" : "欢迎再次购买！",
			"color" : "#173177"
		}
	};
	api.sendTemplate('openid', templateId, url, data, callback);
}