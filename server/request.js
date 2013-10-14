var http = require('http');
var querystring = require('querystring');

// The body of all HTTP messages from the client are assumed 
// to be JSON encoded objects.  Extract this object from the 
// request message. 
var parse =
exports.parse = function(req, maxBytes, cb) {
  var bodyString;
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    if (bodyString === undefined) {
      bodyString = chunk;
    } else {
      bodyString += chunk;
    }
    if (bodyString.length > maxBytes) {
      console.log('maxBytes exceeded for incoming message');
      req.socket.destroy();
      return;
    }
  });
  req.on('end', function() {
    if (bodyString === undefined || bodyString.length === 0) return cb(null, {});
    var body;
    try {
      body = JSON.parse(bodyString);
    } catch (err) {
      console.log('parse error for message body = ' + bodyString);
      console.log(err.message);
      req.socket.destroy();
      return;
    }
    if (body) {
      cb(null, body);
    } else {
      console.log('WARNING: body is false for message body = ' + dataString);
    }
  });
};

var checkString = function(data, fields, req, cb) {
  for(var i = 0; i < fields.length; i++) {
    if (!data.hasOwnProperty(fields[i]) ||
      typeof data[fields[i]] !== 'string' ||
      data[fields[i]].length === 0) {
      console.log('Fields ' + JSON.stringify(fields) + ' bad in ' + JSON.stringify(data));
      req.socket.destroy();
      return;
    }
  }
  cb();
};

exports.check = function(data, fields, req, cb) {
  for(var i = 0; i < fields.length; i++) {
    if (!data.hasOwnProperty(fields[i])){
      console.log('Fields ' + JSON.stringify(fields) + ' bad in ' + JSON.stringify(data));
      req.socket.destroy();
      return;
    }	
  }
  cb();
};

