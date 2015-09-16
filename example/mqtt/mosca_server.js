var mosca = require('mosca');

//https://github.com/mcollina/mosca/wiki/Mosca-advanced-usage

var redisstore = {
  type: 'redis',
  redis: require('redis'),
  db: 1,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: "10.144.240.200"
};

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://10.144.240.200:29017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore,
 /* backend: {
  	 type: 'zmq',
    json: false,
    zmq: require("zmq"),
    port: "tcp://127.0.0.1:33333",
    controlPort: "tcp://127.0.0.1:33334",
    delay: 5
  },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: "mongodb://localhost:27017/mosca"
  } */
};

//here we start mosca
var server = new mosca.Server(settings);
server.on('ready', setup);
 
// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

// fired whena  client is connected
server.on('clientConnected', function (client) {
  console.log('client connected', client.id);
});
 
// fired when a message is received
server.on('published', function (packet, client) {
  console.log('Published', packet.payload.toString("utf-8"));
});

// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log('subscribed : ', topic);
});
 
// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed : ', topic);
});
 
// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
  console.log('clientDisconnecting : ', client.id);
});
 
// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
  console.log('clientDisconnected : ', client.id);
});

// https://github.com/mcollina/mosca
// sudo npm install mqtt -g
// mqtt sub -t 'hello' -h 'localhost' -v
// mqtt pub -t 'hello' -h 'localhost' -m 'from MQTT.js'