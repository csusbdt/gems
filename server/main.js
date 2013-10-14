var http = require('http');
var domain = require('domain');
var root = require('./root');
var get_doc = require('./get_doc');
var buy_gem = require('./buy_gem');
var replyNotFound = require('./response').replyNotFound;
var replyError = require('./response').replyError;

function handleRequest(req, res) {
  console.log('Handling request for ' + req.url);
  if (req.url === '/') {
    root.handle(req, res);
  } else if (req.url === '/get-doc') {
    get_doc.handle(req, res);
  } else if (req.url === '/buy-gem') {
    buy_gem.handle(req, res);
  } else {
    replyNotFound(res);
  }
}

var server = http.createServer();

server.on('request', function(req, res) {
  var d = domain.create();
  d.on('error', function(err) {
    console.error(req.url, err.message);
    replyError(res);
  });
  d.run(function() { handleRequest(req, res); });
});

root.init(function() {
  server.listen(5000);
});

