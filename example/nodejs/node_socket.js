#!/usr/bin/env node

var port = 8000;
var host = '127.0.0.1';
var util = require('util');

var startServer = function() {
     var http = require('http');
     var server = http.Server();
     var io = require('socket.io')(server);
     io.on('connection', function(socket) {
          console.log('Connected!');
          // emit version infomation
          socket.emit('welcome', {'version' : '3.5.2', 'token' : '32jfds456FDSOwewA219bMqx4lPsz2'});
          socket.on('report', function(data) {
               console.log('Reported data: ' + util.inspect(data));
               // do something
               console.log('Computed!');
          });
          socket.on('close', function() {
               console.log('Closed!');
          });
     });
    
     console.log('Start server.');
     server.listen(port, host);
};

var startClient = function() {
     var client = require('socket.io-client');
     var socket = client('http://' + host + ":" + port);
     socket.on('welcome', function(data){
          console.log('Get welcome info from server: ' + util.inspect(data));
          var version = data['version'];
          var token = data['token'];
          console.log('version=' + version + ', token=' + token);
          // do something
          var reportData = {'alive' : ['node-01', 'node-06', 'node-03'], 'dead' : ['node-8']};
          console.log('Report data: ' + util.inspect(reportData));
          socket.emit('report', reportData);
          socket.emit('close');
     });
};

var process = require('process');
var argv = process.argv;
console.log('Passed arguments: ' + argv);

var option = argv[2];
if('server' == option) {
     startServer();
} else if('client' == option) {
     startClient();
} else {
     console.error('Unknown augment: ' + option + '!');
}