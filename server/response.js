var http = require('http');

var reply = 
exports.reply = function(res, data) {
  if (data === undefined) {
    data = {};
  }
  var buf = new Buffer(JSON.stringify(data), 'utf8');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': buf.length,
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache, no-store'
  });
  res.end(buf);
};

exports.replyLogin = function(res) {
  reply(res, { login: true });
};

exports.replyError = function(res, error) {
  if (error === undefined) error = new Error('unspecified error');
  reply(res, {'error': error.message});
};

exports.replyServerError = function(res) {
  res.writeHead(500);
  res.end('server error');
};

exports.replyNotFound = function(res) {
  res.writeHead(404);
  res.end('not found');
}

