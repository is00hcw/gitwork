var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(
        client,
        [
            { topic: 'topic1', partition: 0 }, { topic: 'topic2'  }
        ],
        {
            autoCommit: false
        }
    );
	 
consumer.on('message', function (message) {
    console.log(message);
});
