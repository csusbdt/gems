var http = require('http');

var body;

exports.handle = function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=UTF-8',
    'Content-Length': body.length
  });
  res.end(body);
};

exports.init = function(cb) {
  require('fs').readFile('client/app.html', function(err, data) {
    if (err) throw err;
    body = data;
    cb();
  });
}

