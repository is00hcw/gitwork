var mysql =  require('mysql');
var config = require('./config');
var moment = require("moment");

var pool = mysql.createPool({
  connectionLimit: config.mysql.connectionLimit, //important
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  debug: config.mysql.debug
});


function withConnection(callback){
   pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.status(500);
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);

        connection.on('error', function(err) {    
              res.status(500);  
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
        
        callback(connection)
  });
}

function db_fun_creator(sql, func){
  return function(callback, params){
    withConnection(function(connection){
         if(typeof params === "undefined" || params === null){
            params = func;
            if(typeof func === "function")
              params = func();
         }
         
          console.log("sql:" + sql);
          console.dir(params);
          connection.query(sql,params, function(err,rows){
              connection.release();
              callback(err,rows); 
          });
    })
  }
}

// 添加比赛信息
exports.createMatch=db_fun_creator("insert into `match` set ?", null);

// 查询某场比赛
exports.getMatch=db_fun_creator("select * from `match` where match_id=?", null);

// SELECT * FROM `match` WHERE match_date="2016-06-13" AND match_time="00:00" AND teamA="波兰" AND teamB="北爱尔兰"
exports.findMatch=db_fun_creator("SELECT * FROM `match` WHERE match_date=? AND match_time=? AND teamA=? AND teamB=?", null);

// 更新比赛结果
exports.updateMatch=db_fun_creator("update `match` set ? where match_id=?", null);

// 更新挑战结果，忽略没有应战者的挑战
exports.updateChallengeResult=db_fun_creator('UPDATE challenge SET winner_wechat_id=(CASE WHEN challenger_bet=? THEN  challenger ELSE acceptor END ),  winner_team=?, match_result=?  WHERE match_id=? AND acceptor IS NOT NULL AND acceptor <> "" ', null);

// 查询所有比赛
exports.listAllMatches=db_fun_creator("SELECT * FROM `match` ORDER BY match_date, match_time", null);

//查询今天比赛
exports.listTodayMatches=db_fun_creator("select * from `match` WHERE match_date=?", function(){
  return [moment().format("YYYY-MM-DD")];
} );

//查询某一天的比赛
exports.listMatches=db_fun_creator("select * from `match` WHERE match_date=?");
// 查询所有获奖的用户地址
exports.listAllUserAddrs=db_fun_creator("select * from user_addr", null);
// 添加用户收货地址
exports.createUserAddr=db_fun_creator("insert into user_addr set ?", null);
//更新用户收货地址
exports.updateUserAddr=db_fun_creator("update user_addr set ? where wechat_id=?", null);
// 查询用户收货地址
exports.getUserAddr=db_fun_creator("select * from user_addr where wechat_id=?", null);

// 查询我发起的挑战, 忽略没有应战者的挑战
exports.getMyChanllenge=db_fun_creator("SELECT * FROM challenge c, `match` m WHERE challenger=? AND c.match_id=m.match_id AND acceptor IS NOT NULL", null);

// 查询我接受的挑战
exports.getMyAccept=db_fun_creator("SELECT * FROM challenge c, `match` m WHERE acceptor=? AND c.match_id=m.match_id", null);

// 查询我胜利的挑战
exports.getMyWin=db_fun_creator("SELECT * FROM challenge c, `match` m WHERE winner_wechat_id=? AND c.match_id=m.match_id AND (challenger=winner_wechat_id OR acceptor=winner_wechat_id)  ORDER BY seq_no", null);
//exports.getMyWin=db_fun_creator("SELECT * FROM challenge c, `match` m WHERE winner_wechat_id=? AND acceptor IS NOT NULL  AND c.match_id=m.match_id AND (challenger=winner_wechat_id OR acceptor=winner_wechat_id)  ORDER BY seq_no", null);

// 查询我胜利的场数
exports.getMyWinCount=db_fun_creator("SELECT COUNT(1) AS win_count FROM challenge c, `match` m WHERE winner_wechat_id=? AND c.match_id=m.match_id AND (challenger=winner_wechat_id OR acceptor=winner_wechat_id)", null);
//exports.getMyWinCount=db_fun_creator("SELECT COUNT(1) AS win_count FROM challenge c, `match` m WHERE winner_wechat_id=? AND acceptor IS NOT NULL  AND c.match_id=m.match_id AND (challenger=winner_wechat_id OR acceptor=winner_wechat_id)", null);

// 统计胜场
exports.getWinStat=db_fun_creator("SELECT winner_wechat_id, COUNT(1) AS win_count FROM challenge c, `match` m WHERE  c.match_id=m.match_id AND (challenger=winner_wechat_id OR acceptor=winner_wechat_id) GROUP BY winner_wechat_id ORDER BY win_count DESC", null);
//exports.getWinStat=db_fun_creator("SELECT winner_wechat_id, COUNT(1) AS win_count FROM challenge c, `match` m WHERE  c.match_id=m.match_id AND acceptor IS NOT NULL  AND (challenger=winner_wechat_id OR acceptor=winner_wechat_id) GROUP BY winner_wechat_id ORDER BY win_count DESC", null);
// HAVING win_count >= 1 

// 查询用户在某场比赛的挑战
//exports.getMyChallengeOnMatch=db_fun_creator("SELECT COUNT(1) FROM challenge c WHERE match_id=? AND challenger=? ", null);
exports.getMyChallengeOnMatch=db_fun_creator("SELECT * FROM challenge WHERE match_id=? AND (challenger=? OR acceptor=?)", null);

// 发起挑战
exports.createChallenge=db_fun_creator("insert into challenge set ?", null);
// 查询挑战
exports.getChallenge=db_fun_creator("SELECT * FROM challenge WHERE challenge_id=?", null);
// 挑战详细信息
exports.getChallengeDetail=db_fun_creator("SELECT * FROM challenge c, `match` m WHERE challenge_id=? AND c.match_id=m.match_id", null);

// 接受挑战
exports.acceptChallenge=db_fun_creator("update challenge set ? where challenge_id=?", null);

// 统计参与玩家数目
exports.countAllPlayers=db_fun_creator("SELECT COUNT(1) AS count FROM ((SELECT DISTINCT challenger AS id FROM challenge) UNION ( SELECT DISTINCT acceptor AS id FROM challenge WHERE acceptor IS NOT NULL)) AS player" ,null);
// 统计挑战数目
exports.countAllChallenge=db_fun_creator("SELECT COUNT(1) AS count FROM challenge c", null);



/*-------------delete

  pool.getConnection(function(err,connection){
if (err) {
  connection.release();
  res.json({"code" : 100, "status" : "Error in connection database"});
  return;
}   

console.log('connected as id ' + connection.threadId);

connection.query("select * from card_base_info",function(err,rows){
    connection.release();
    if(!err) {
        res.json(rows);
    }           
});

connection.on('error', function(err) {      
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;     
});
});   

exports.findCards=function(callback){
	console.log("findCards..\n");
	withConnection(function(connection){
        connection.query("select * from card_base_info", function(err,rows){
             connection.release();
             callback(err,rows); 
         });
   })
}

*/