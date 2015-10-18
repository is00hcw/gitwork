var wechat = require('wechat');
var WechatAPI = require('wechat-api');
var jsonfile = require('jsonfile');

var appConfig = jsonfile.readFileSync('./config.json');
console.dir(appConfig);

/* create wechat menu ---
var api = new WechatAPI(appConfig.appid, appConfig.appsecret);
api.createMenu({
    "button": [  {
      "type": "view",
         "name": "扫描二维码",
        "url": "http://qdapp.atsmart.io/node/wechat/scan"
    }, {
      "type": "view",
        "name": "测试",
        "url": "http://qdapp.atsmart.io/node/wechat/test"
    }]
  }, function(err, result) {
  if (err) {
    console.log("create wechat menu failed..." + err);
  } else if (result.errcode !=0 ) {
    console.log(result.errmsg)
  } else {
    console.log("create wechat menu ok");
  }
});
  create wechat menu --- */


// wechat handler
var config = {
  token: appConfig.token,
  appid: appConfig.appid,
  encodingAESKey: appConfig.aeskey
};

var handler = wechat(appConfig.token, function (req, res, next) {
  var message = req.weixin;
  console.dir(message);
  var identifier = '';
  switch (message.Event) {
    case 'LOCATION':
      res.reply({type: "text", content: 'LOCATION ' + message.Latitude + "," + message.Longitude});
      return ;
    default:
      if(message.MsgType === 'image' || message.MsgType === 'voice' || message.MsgType === 'video' ){
         res.reply({type: "text", content: ' ' + message.MsgType  + "," + message.MediaId});
         return;
      }
      console.log('unhandled event: ' + message.Event);
  }

  res.reply([
    {
      title: '你来我家接我吧',
      description: '这是女神与高富帅之间的对话',
      picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
      url: 'http://nodeapi.cloudfoundry.com/'
    }
  ]);
});


module.exports = handler;

