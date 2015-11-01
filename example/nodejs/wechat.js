var wechat = require('wechat');
var WechatAPI = require('wechat-api');
var jsonfile = require('jsonfile');

var appConfig = jsonfile.readFileSync('./config.json');
console.dir(appConfig);



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
    default:
      console.log('unhandled event: ' + message.Event);
  }

  res.reply('');
});

module.exports = handler;

