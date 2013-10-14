var assert      = require('assert');
var querystring = require('querystring');
var http        = require('http');

// Send request and receive data (a Javascript object).
// options are the same as for http.request
// cb = function(data) where data is Error or Object
function send(options, reqData, cb) {
  var req;
  
  // create request
  req = http.request(options, function(res) {
    var bodyString;  // to be converted to Javascript object
    
    // tell node how to convert received bytes to a Javascript string
    res.setEncoding('utf8');
    
    // accumulate data
    res.on('data', function (chunk) {
      if (bodyString === undefined) bodyString = chunk; else bodyString += chunk;
    });
    
    // parse received data
    res.on('end', function() {
      var body;
      try {
        body = JSON.parse(bodyString);
      } catch (err) {
        console.log(err.message);
        return cb(err);
      }
      cb(null, body);
    });
  });
  
  // register error listener
  req.on('error', function(err) { 
    err.message += '\ndb.send: request error';
    cb(err); 
  });

  // send request
  if (reqData) {
    req.write(JSON.stringify(reqData));
  }
  req.end();
};

exports.getDoc = function(_id, cb) {
  var options = {
      hostname: 'localhost',
      auth: 'admin:1234',
      port: 5984,
      path: '/gems/' + _id, 
      method: 'GET'
  };
  send(options, null, function(err, doc) {
    if (err) cb(err);
    else cb(null, doc);
  });
};

exports.updateDoc = function(doc, cb) {
  var options = {
      hostname: 'localhost',
      auth: 'admin:1234',
      port: 5984,
      path: '/gems/' + doc._id, 
      method: 'PUT'
  };
  send(options, doc, function(err, result) {
    if (err) return cb(err);
    if (result.error) {
      if (result.error === 'conflict') {
        return cb(null, { old: true });
      } else {
        console.log('db.send error: ' + result.error);
        return cb(new Error(result.error));
      }
    }
    if (result.ok) {
      return cb(null, { rev: result.rev });
    }
    console.log('unexpected in db.updateDoc: ' + JSON.stringify(result));
    cb(new Error('unexpected'));
  });
};

