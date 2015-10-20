var restify = require('restify');
 


var server = restify.createServer({
    name: 'CER Web Service',
    versions: ['1.0.0']
});

server.use(restify.pre.userAgentConnection());          // work around for curl
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// static files: /, /index.html, /images...
server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: 'public', default: "index.html" }));

// testing the service
server.get('/test', function (req, res, next) {
    res.send("testing...");
    next();
});

 

server.listen(5000, function () {
    console.log('%s listening at %s', server.name, server.url);
});
