
var mqtt = require('mqtt');

var client = mqtt.createClient(1883, 'localhost', { clientId: '1', clean: false });

client.subscribe('order', { qos: 1 });

client.on('message', function (topic, message) {
  console.log(message.toString("utf-8"));
});