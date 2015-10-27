/**
 *  npm install node-zookeeper-client
 *   https://github.com/alexguan/node-zookeeper-client
 */


var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('localhost:2181');
var path = "/node_test";

client.once('connected', function () {
    console.log('Connected to the server.');

    client.create(path, function (error) {
        if (error) {
            console.log('Failed to create node: %s due to: %s.', path, error);
        } else {
            console.log('Node: %s is successfully created.', path);
        }

        client.close();

        testList();
    });
});

client.connect();


function listChildren(client, path) {
    client.getChildren(
        path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren(client, path);
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }

            console.log('Children of %s are: %j.', path, children);
        }
    );
}



function testList(){
    client = zookeeper.createClient('localhost:2181');
    client.once('connected', function () {
        console.log('Connected to ZooKeeper.');
        listChildren(client, path);
    });

    client.connect();
}