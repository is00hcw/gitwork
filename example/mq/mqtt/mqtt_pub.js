
var mqtt = require('mqtt');

var client = mqtt.createClient(1883, 'localhost');

//client.subscribe('presence');
var num = 0;
setInterval(function () {
  client.publish('order', 'Hello mqtt ' + (num++), { qos: 1, retain: true });
}, 1000);