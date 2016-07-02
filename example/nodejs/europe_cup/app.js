//  https://itjh.net/2016/02/22/nodejs-restify-restapi-mysql/
//https://oneapm.kf5.com/posts/view/43673/

//require('oneapm');
var CookieParser = require('restify-cookies');
var restify = require('restify');
var redis = require("redis");
var fs = require("fs");
var winston = require('winston');
var moment = require("moment");
var transliteration = require('transliteration');
var tr = transliteration.transliterate
var slug = transliteration.slugify;

var config = require('./config');
var routes = require('./routes');
var db = require('./db')
var wx = require('./wx');
var schedule = require('node-schedule');

SERVER_PORT = 3168 ; // admin 3168  3000

var WIN_COUNT = 10;  //获取奖品需要赢得10场

var SERVER_BASE = config.server_base ;

 var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'winston.log' })
    ]
  });
// logger.info('Hello again distributed logs');
 
 function pinyin(str){
   return slug(str).replace(/\-/g,"").toLowerCase();
 }
 
//加载目录下文件
var controllers = {};
var controllers_path = process.cwd() + '/controllers' ;
fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.indexOf('.js') != -1) {
    controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
  }
});


if (process.env.environment == 'production') {
  process.on('uncaughtException', function (err) {
    console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
  });
} else {
  process.on("uncaughtException", function (err) {
    console.log('-- [' + (new Date()).toUTCString() + ' ] Caught unhandled exception:' + (err.stack || err));
    //正式版关闭以下行,防止程序异常中止
		  //process.exit();  
  });
}

var redis_client = redis.createClient(config.redis.port, config.redis.ip, { connect_timeout: config.redis.timeout }); //增加超时选项
wx.init(redis_client);

redis_client.on('error', function (error) {
  console.log(error);
});



/*
redis_client.set("Testing", "string val", redis.print);

redis_client.get("Testing", function (err, replies) {
  console.log(replies);
});

// 设置一个字符串类型的值，返回值：OK
redis_client.set("string key", "Hello World", function (err, reply) {
  console.log(reply.toString());
});

//redis_client.del("weixin_ticketToken");
*/

var server = restify.createServer({
  name: 'atsmart_api',
  version: '1.0.0'
});

// http://mcavage.me/node-restify/#Bundled-Plugins

server.use(restify.pre.userAgentConnection());          // work around for curl  
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
//server.use(restify.jsonp());
//server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true,
  overrides: {
    '192.168.1.1': {
      rate: 0,        // unlimited
      burst: 0
    }
  }
}));
server.use(CookieParser.parse);
server.use(function(req,res,next){
  logger.info("filter oauth:" + req.url);
  if(req.url.indexOf("europe.htm") > -1 || req.url.indexOf("battle.html") > -1 || req.url.indexOf("wo.html") > -1){
   // console.log("oauthUrl+++")
    wx.oauthUrl(SERVER_BASE + req.url , req, res, next);
  }else
    next();
})

server.get(/\/act\/public\/(.*)/, restify.serveStatic({ directory: './static', default: "index.html" }));

// ========后台管理接口=========

server.get('/act/match/list', function(req, res, next) {  // 查询所有比赛
  db.listAllMatches(function (err, rows) {
    if (!err) {
      res.json({"code":200, "data":rows});
    }
  });
});

//  清除比赛缓存
server.get('/act/clean_match/:date', function(req, res, next) {
  var key = "match_" + req.params.date;
  logger.warn("clean redis: %s", key);
  redis_client.del(key, redis.print);  
  res.json({"code":200});
});


// 创建比赛信息
server.post('/act/match/create', function(req, res, next) {  //  创建比赛
   logger.warn("create match: " + req.body);
   var data = req.body;
   data.match_id = data.match_date + "_" + data.match_time.replace(":","") + "_" + pinyin(data.teamA) + "-" + pinyin(data.teamB);
   if(!data.teamA_img)
      data.teamA_img = pinyin(data.teamA) +".jpg";  // 默认队名的拼音
   if(!data.teamB_img)
      data.teamB_img = pinyin(data.teamB) +".jpg";  // 默认队名的拼音
   
   logger.warn("new matchid: " + data.match_id);
   db.createMatch(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else{
      res.json({"code":200, "data":rows});
     }
   },data);

// 清除比赛cache
    var key = "match_" + data.match_date;
    logger.warn("clean redis: %s", key);
    redis_client.del(key, redis.print);  
});

server.get('/act/user_addr/list', function(req, res, next) {  //  所有获取奖品用户
   db.listAllUserAddrs(function (err, rows) {
    if (!err) {
     res.json({"code":200, "data":rows});
    }
  });
});

server.get('/act/user_addr/:wechat_id', function(req, res, next) {  //  
  var wechat_id = req.params.wechat_id;
   db.getUserAddr(function (err, rows) {
    if (!err) {
     res.json({"code":200, "data":rows});
    }
  },[wechat_id]);
});

server.post('/act/wechat/send/:wechat_id', function(req, res, next) {  //  
  var wechat_id = req.params.wechat_id;
  var data = req.body;
  logger.info("wechat msg send: %s  %s" , wechat_id, JSON.stringify(data) );
     wx.SendText(wechat_id, data.text, function(err, result){
        if(err){
          res.json({"code":500, "msg":err})
        }else{
          res.json({"code":200, "data":result});
        }
     })
});

// 更新比赛结果
server.post('/act/match_result/update', function(req, res, next) {  //  更新比赛结果
   var match_id = req.params.match_id ;
   var data = req.body;
   logger.warn("update match result: " + match_id + " , " + JSON.stringify(data));
  
   var params = {"match_result" : data.match_result, "winner_team": data.winner_team }
   db.updateMatch(function (err, rows) {
      console.log(rows);
      if(err){
        res.json({"code":500, "msg":err})
      }else{
        updateChallengeResult(match_id, params, req, res, next);
      }
    }, [params, match_id ]);

    cleanMatchCache(match_id);
});

function cleanMatchCache(match_id){
 // 清除比赛cache
 db.getMatch(function (err, rows) {
      console.log(rows);
      if(!err && rows.length > 0){
          var key = "match_" + rows[0].match_date;
          logger.warn("cleanMatchCache redis: %s", key);
          redis_client.del(key, redis.print); 
      }
 }, [ match_id ]);
}

function updateChallengeResult(match_id, data, req, res, next){
  db.updateChallengeResult(function (err, rows) {
      console.log(rows);
      if(err){
        res.json({"code":500, "msg":err})
      }else{
        res.json({"code":200, "data":rows});
      }
    }, [data.winner_team, data.winner_team ,  data.match_result, match_id ]);
}
 
server.get('/act/user_win/stat', function(req, res, next) {  
   db.getWinStat(function(err,rows){
      console.log(rows);
      if(err){
        res.json({"code":500, "msg":err})
      }else{
        res.json({"code":200, "data":rows});
      } 
   })
});

 server.get('/act/user_win/:wechat_id', function(req, res, next) {  
   var wechat_id = req.params.wechat_id ;
    
   db.getMyWinCount(function(err,rows){
      console.log(rows);
      if(err){
        res.json({"code":500, "msg":err})
      }else{
        res.json({"code":200, "data":rows});
      } 
   },[wechat_id])
});

//** 自动更新结果
var expr =  '10 0 0 * * *';
var crontask = schedule.scheduleJob(expr, function(){  // 每天凌晨10s
  console.log('check match list everyday task: ' + new Date());
  everydayTask();
});


var matchList = {};

var qq_client = restify.createJsonClient({
  url: 'http://matchweb.sports.qq.com/'
});

function everydayTask(){  // 获取每天比赛
     getQQMatchs(function(err,obj){
        console.log("code:" + obj.code);
        if(obj.code === 0){  
            var data = obj.data;
            var now = moment().format("YYYY-MM-DD");
            console.log(now);
           // console.log(JSON.stringify(data[now]));
            var matchs = data[now];
            matchList[now] = matchs;
            for(var i = 0; i < matchs.length; i ++){
                console.log("watch: " +JSON.stringify(matchs[i]));
                var startTime = matchs[i].startTime;
                var time = moment(startTime, "YYYY-MM-DD HH:mm:SS"); 
                var stopTime = time + 1000 * 60 * 90;  // 比赛90分钟
               // console.log("time:" +time);
                var cur = +new Date();
                var delay = stopTime - cur ;  
                if(delay < 0)
                    delay = 5000;
                console.log("start:" + new Date(time) + " ,stop:" + new Date(stopTime) + " ,delay: " + delay);
                delayWatch(matchs[i], delay )  
            }
        }
    })
}

function delayWatch(m, delay){
    setTimeout(function(){
        watchGame(m); 
    }, delay )  
}

function watchGame(obj){  // 监控比赛结果
    try{ 
        var isComplete = false;
        if(livePeriod in obj && obj.livePeriod == "2")
          isComplete = true;
        console.log("watchGame, complete: " + isComplete + ", " + JSON.stringify(obj));
        var startTime = obj.startTime;
        if(isComplete){ 
          //  var time = moment.moment(startTime, "YYYY-MM-DD HH:mm:SS"); 
            var teamA = obj.leftName;
            var teamB = obj.rightName;  
            var goalA = parseInt(obj.leftGoal);
            var goalB = parseInt(obj.rightGoal);
            var result = goalA + ":" + goalB;
            var winteam = "";
            if( goalA > goalB)
                winteam = teamA;
            else if(goalA < goalB)
                winteam = teamB;
            autoUpdateResult(startTime, teamA, teamB, result, winteam);
            return ;
        }
    }catch(e){
        console.log(e);
    }
   
    setTimeout(function(){
       getQQMatchs(function(err,new_obj){
          if(new_obj.code === 0){  
              var data = new_obj.data;
              var times = startTime.split(" ");
              var matchs = data[ times[0] ];
              for(var i = 0; i < matchs.length; i ++)
                if(matchs[i].mid === obj.mid){  // 找到原来那场比赛
                  watchGame( matchs[i] )
                }
            
          }else{
            console.log("getQQMatchs err 2:" + JSON.stringify(new_obj))
          }

       });

    }, 1000 * 20)  //每20秒检查一次 比赛结束
    
}

function autoUpdateResult(startTime, teamA, teamB, result, winteam) {
    
    var times = startTime.split(" ");
    var matchDate = times[0];
    var matchTime = times[1].substr(0,times[1].lastIndexOf(":"));
    logger.warn("+++autoUpdateResult params: " + matchDate + ", " + matchTime + ", " + teamA + ", " + teamB + ", " + result)
    db.findMatch(function(err,rows){
        if(!err && rows && rows.length > 0){ 
            logger.warn("--find match: " + JSON.stringify(rows) );
            var match_id = rows[0].match_id;  //比赛id
            var params = {"match_result" : result, "winner_team": winteam };
            logger.warn("--before update: " + match_id + ", " + JSON.stringify(params) );
            db.updateMatch(function (err, rows) {
                if(err){
                    logger.warn("err: " + err);
                }else{
                    doUpdateChallengeResult(match_id, params);
                }
            }, [params, match_id ]);
         }           
    },[matchDate, matchTime, teamA, teamB])
} 

function  doUpdateChallengeResult(match_id, data){
 db.updateChallengeResult(function (err, rows) {
      console.log(rows);
      if(err){
        logger.warn("err: " + err);
      }
    }, [data.winner_team, data.winner_team ,  data.match_result, match_id ]);
}

function getQQMatchs(callback){
  var now = +new Date();
	qq_client.get("/kbs/list?callback=_&columnId=3&startTime=2016-05-08&endTime=2016-07-14&_=" + now, function (err, req, res, obj) {
        if(!err){
			
		}else{
            // setTimeout(function(){
            //     getQQMatchs(callback);
            // }, 10000)
            console.log("getQQMatchs err:" + err)
        }
        var body = res.body;
        if(body){
            obj = eval(body.substring(1));
            //console.log(JSON.stringify(obj));
            callback(err,obj);
        }
	});
}

everydayTask();  // 今晚 9点那场
 //--------------------

// 查看用户信息
/*
server.get('/act/user_info/:openid', function (req, res, next) {
	logger.info('openid: %s', req.params.openid);
	wx.getUserInfo(req.params.openid, function(err,rows){
		  res.setHeader('Content-Type', 'application/json');
       logger.info('wechat: ' + JSON.stringify(rows));
	     if (!err) {
          res.json({"code":200, "data":rows});
        }
	});
});
*/

server.get('/act/user_info/:openid', function (req, res, next) {
  var openid = req.params.openid
	logger.info('openid: %s', openid);
  var key = "ec_" + openid;
  redis_client.get(key, function (err, replies) {
    if(err || !replies){
       // 没有cache，查询数据库
        wx.getUserInfo(openid, function(err,rows){
            res.setHeader('Content-Type', 'application/json');
            logger.info('wechat: ' + JSON.stringify(rows));
            if (!err) {
                res.json({"code":200, "data":rows});
              }
        });
     }else{
      logger.info("redis userinfo: %s=%s",key, replies);
      res.json({"code":200, "data":JSON.parse(replies)});
    }
  })
});

 
  
server.post('/act/challenge/create', function(req, res, next) {   
  // TODO 判断比赛截止时间
   var openid = req.params.openid;
   logger.warn("create challenge: " + openid +　" , "　 + JSON.stringify(req.body) );
  　var data = req.body;
   db.getMyChallengeOnMatch(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else {
       for(var i = 0 ;i < rows.length; i ++){
         var row = rows[i];
         //console.log(row);
         // 某场比赛 已经发起挑战，或者应战过且选的队伍为同一个
         if(row.challenger === openid || (row.acceptor === openid && row.acceptor_bet === data.challenger_bet)){
            res.json({"code":401, "msg":"挑战失败，不能重复下注，请查看比赛规则！"});
            return;
         }
       }
       
       db.getMatch(function (err, rows) {
         if(!err && rows.length >0){
           console.log("check match:" + JSON.stringify(rows));
           var now = moment().format("YYYY-MM-DD HH:mm");
           var time = rows[0].match_date + " " + rows[0].match_time;
           if(now > time || rows[0].match_result ){  // 比赛结束，下注过期了
              res.json({"code":402, "msg":"挑战失败，已停止下注！"});
              return;
           }
           createChallenge(openid, data, req, res, next);
         }
       }, [data.match_id]);
       
     }
   }, [data.match_id, openid, openid] );
});

function createChallenge(openid, data, req, res, next){
   data.challenge_id = openid + "_" + data.match_id +"_" + (new Date().getTime()); // 生成挑战id
   data.challenger = openid; //挑战者id
   data.create_time = moment().format("YYYY-MM-DD HH:mm:ss");
   db.createChallenge(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else{
      res.json({"code":200, "data":{"challenge_id": data.challenge_id} })
     }
   }, data);
}

//
server.post('/act/challenge/accept', function(req, res, next) {   
   var openid = req.params.openid;
   var challenge_id = req.params.challenge_id;
   logger.warn("accept challenge: " + openid +　" , "　+ challenge_id + " , " + JSON.stringify(req.body)) ;
   
   db.getChallenge(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else {
       if(rows.length > 0){
         if(rows[0].acceptor)
            res.json({"code":403, "msg":"来晚了，已经被抢了"})
         else if(rows[0].match_result )
            res.json({"code":403, "msg":"比赛已结束，不能应战，请查看游戏规则"})
         else if(rows[0].challenger === openid)
            res.json({"code":401, "msg":"不能应战，请查看游戏规则"})
         else{
           acceptChallengeStep1(challenge_id, openid, req.body, rows[0], req, res, next)
         }         
       }else{
         res.json({"code":500, "msg":"不能应战，没找到挑战记录"})  // 不应该出现
       }
     }
   },[challenge_id]);
})

server.get('/act/challenge/:challenge_id', function(req, res, next) { 
  var challenge_id = req.params.challenge_id;
  console.log(challenge_id)
  db.getChallengeDetail(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else {
        res.json({"code":200, "data":rows});
     }
  },[challenge_id]);
})

function acceptChallengeStep1(challenge_id, openid, data, challenge_rec, req, res, next){
  var match_id = challenge_rec.match_id;
    db.getMyChallengeOnMatch(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else {
       for(var i = 0 ;i < rows.length; i ++){
         var row = rows[i];
         // 某场比赛 已经接受过挑战，或者曾发挑战且选的队伍为同一个
         if(row.acceptor === openid || (row.challenger === openid && row.challenger_bet === data.acceptor_bet)){
            res.json({"code":400, "msg":"应战失败，不能重复下注，请查看比赛规则！"});
            return;
         }
       }
        db.getMatch(function (err, rows) {
         if(!err && rows.length >0){
           console.log("check match:" + JSON.stringify(rows));
           var now = moment().format("YYYY-MM-DD HH:mm");
           var time = rows[0].match_date + " " + rows[0].match_time;
           if(now > time){  // 下注过期了
              res.json({"code":400, "msg":"接收挑战失败，已停止下注！"});
              return;
           }
            acceptChallengeStep2(challenge_id, openid, data, req, res, next);
         }
       } , [match_id]);
      
     }
   }, [match_id, openid, openid] );
}

function acceptChallengeStep2(challenge_id, openid, data, req, res, next){
   data.acceptor = openid; // 接受挑战者id
 
   db.acceptChallenge(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else{
       res.json({"code":200  })
       sendWechatNotify(challenge_id, openid, data);
     }
   }, [data, challenge_id ]);
}

function sendWechatNotify(challenge_id, openid, data){
  db.getChallengeDetail(function (err, rows) {
     console.log("sendWechatNotify :" + rows);
     var templateId = "Bc4zBPs5Pbk-xHgyF8e_kZToQx9heMpm7zZCCKEDFHg" ; // "75Io5bsuJY6oRBZq0_CWE8HB4Ngu3nJV4w1mATqiQd8"
     if(!err){
       var params = {
         "first": {
	    			"value": rows[0].challenger_name + "，您发出的挑战对方已经应战！"
          },
          "keyword1" :{
	          "value":"猜球大战"
          },
          "keyword2" :{
             "value": data.acceptor_name
          },
         "keyword3" :{
	          "value": moment().format("YYYY年MM月DD HH:mm")
          },
          "remark" :{
             "value":"点击这里，查看战书和猜球结果。"
          }
       };
       console.log(params);
       wx.sendTemplate(rows[0].challenger,templateId, "http://qdapp.atsmart.io/act/public/wo.html", params, function(err,result){
           if(err){
             console.error(err);
           }else{
             console.log(result)
           }
       } );
     } 
  },[challenge_id]);
}

server.post('/act/user_addr/create', function(req, res, next) {  //  提交获奖用户信息
   logger.warn("create user_addr: " + JSON.stringify(req.body));
   var data = req.body;
   var wechat_id = data.wechat_id;
    //检查是否赢了10场
   db.getMyWinCount(function(err,rows){
      console.log(rows);
      if(err){
        res.json({"code":500, "msg":err})
      }else{
        if(rows.length < 1 || rows[0].win_count < WIN_COUNT){
          res.json({"code":404,"msg":"提交地址失败，不满足获奖条件"})
        }else{
          doCreateUserAddr(data,req, res, next) 
        }
      } 
   },[wechat_id])
});

function  doCreateUserAddr(data,req, res, next){
   db.createUserAddr(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else{
       if(rows.affectedRows === 0)
          res.json({"code":400,"msg":"提交地址失败，请重试!"})
       else
          res.json({"code":200, "data":rows});
     }
   },data);
}

server.post('/act/user_addr/update', function(req, res, next) {  //  修改获奖用户信息
   logger.warn("update user_addr: " + req.params.wechat_id + " " + JSON.stringify(req.body));
   var wechat_id = req.params.wechat_id ;
   var data = req.body;
   db.updateUserAddr(function (err, rows) {
     console.log(rows);
     if(err){
       res.json({"code":500, "msg":err})
     }else{
       if(rows.affectedRows === 0)
          res.json({"code":400,"msg":"找不到更新记录"})
       else
          res.json({"code":200, "data":rows});
     }
   },[data, wechat_id]);
});

server.get('/act/my_challenge/:openid', function(req, res, next) { 
   var openid = req.params.openid;
   db.getMyChanllenge(function (err, rows) {
    if (!err) {
      res.json({"code":200, "data":rows});
    }
  }, [openid]);
});

server.get('/act/my_accept/:openid', function(req, res, next) { 
    var openid = req.params.openid;
   db.getMyAccept(function (err, rows) {
    if (!err) {
      res.json({"code":200, "data":rows});
    }
  }, [openid] );
});

server.get('/act/my_win/:openid', function(req, res, next) { 
    var openid = req.params.openid;
   db.getMyWin(function (err, rows) {
    if (!err) {
      res.json({"code":200, "data":rows});
    }
  }, [openid] );
});


server.get('/act/match/today', function(req, res, next) {
  var date = moment().format("YYYY-MM-DD");
  handleMatchList(date,req, res, next);
  // db.listTodayMatches(function (err, rows) {
  //   if (!err) {
  //     res.json(rows);
  //   }
  // });
});

server.get('/act/match/:date', function(req, res, next) {
  handleMatchList(req.params.date,req, res, next);
  // db.listMatches(function (err, rows) {
  //   if (!err) {
  //     res.json(rows);
  //   }
  // }, [req.params.date]);
});

function handleMatchList(date, req, res, next){
  var key = "match_" + date;
  redis_client.get(key, function (err, replies) {
    if(err || !replies){
       // 没有cache，查询数据库
      db.listMatches(function (err, rows) {
        if (!err) {
          res.json({"code":200, "data":rows});
          redis_client.set(key, JSON.stringify(rows) , redis.print);  
        }
      }, [date]);
    }else{
      logger.info("redis match: %s=%s",key, replies);
      res.json(JSON.parse(replies));
    }
  });
}

// 微信页面js签名
server.post('/act/jsticket', function (req, res, next) {
  var data = JSON.parse(req.body);

  wx.getJsConfig(data.url, function (err, result) {
    console.log("jsconfig:" + JSON.stringify(result));
    //res.setHeader('Content-Type', 'application/json');
    res.json({"code":200, "data":result});
    return next();
  });
});


function loadStaticFile(filePath, res, next) {
   // var filePath = __dirname + "static/act/public/" + getFileName(req);
   // console.log("Returning " + filePath);

    fs.readFile(filePath, function(err, data) {
      if (err) {
        res.writeHead(500);
        res.end("");
        next(err);
        return;
      }

    //  res.contentType = mime.lookup(filename);
      res.writeHead(200);
      res.end(data);
      return next();
    });
}

function getFileName(req) {
    var filename = "";
    if (req.url.indexOf("/") == (req.url.length-1)) {
      filename = req.url + "index.html";
    } else {
      console.log("What Now?");
    }
    return filename;
}

 
/*
server.get('/act/start',function (req, res, next) {
	console.log("start---" + req.url);
//	wx.oauthUrl('http://qdapp.atsmart.io/act/start',req, res, next)
  var cookies = req.cookies; 
 // res.send(JSON.stringify(cookies));
 
  var filePath = __dirname + "/static/act/public/" + "europe.htm";
  console.log(filePath)
  loadStaticFile(filePath, res,next); 
})

server.get('/act/cookie',function (req, res, next) {
  var cookies = req.cookies; // Gets read-only cookies from the request
  var val = 'Hi ' + Math.random();
  console.log(val + "\n")
  res.setCookie('my-new-cookie',  val); // Adds a new cookie to the response
  //res.send(JSON.stringify(cookies));
  
  var filePath = __dirname + "/static/act/public/" + "europe.htm";
  console.log(filePath)
  loadStaticFile(filePath, res,next);
})
*/


var port = process.env.PORT || SERVER_PORT;
server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
 