//  https://itjh.net/2016/02/22/nodejs-restify-restapi-mysql/
//https://oneapm.kf5.com/posts/view/43673/

 require('oneapm');
var restify = require('restify');

var mysql =  require('mysql');


var pool      =    mysql.createPool({
    connectionLimit : 10, //important
    host     : '115.28.72.210',
    user     : 'root',
    password : 'is00hcw',
    database : 'card',
    debug    :  true
});

function withConnection(callback){
   pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);

        callback(connection)

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}


function handle_database(req,res) {
    withConnection(function(connection){
         connection.query("select * from card_base_info",function(err,rows){
              connection.release();
              if(!err) {
                  res.json(rows);
              }           
          });
    })
      
        
   /* pool.getConnection(function(err,connection){
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
  });  */
}
 

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer({
   name: 'ds_api',
  version: '1.0.0'
});

// http://mcavage.me/node-restify/#Bundled-Plugins

server.use(restify.pre.userAgentConnection());          // work around for curl  
server.use(restify.acceptParser(server.acceptable));  
//server.use(restify.authorizationParser());
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

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get('/test', handle_database);

server.listen(8082, function() {
  console.log('%s listening at %s', server.name, server.url);
});