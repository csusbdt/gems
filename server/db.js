var assert      = require('assert');
var querystring = require('querystring');
var http        = require('http');

// Send request and receive data (a Javascript object).
// options are the same as for http.request
// cb = function(err, resData) 
function send(options, reqData, cb) {
  var req;
  
  // create request
  req = http.request(options, function(res) {
    var resDataString;  // to be converted to Javascript object
    
    // tell node how to convert received bytes to a Javascript string
    res.setEncoding('utf8');
    
    // accumulate data
    res.on('data', function (chunk) {
      if (resDataString === undefined) resDataString = chunk; else resDataString += chunk;
    });
    
    // parse received data
    res.on('end', function() {
      var resData;
      try {
        resData = JSON.parse(resDataString);
      } catch (err) {
        console.log(err.message);
        return cb(err);
      }
      cb(null, resData);
    });
  });
  
  // register error listener
  req.on('error', function(err) { 
    console.log('db.send error: ' + err.message);
    cb(err); 
  });

  // send request data
  if (reqData) {
    req.write(JSON.stringify(reqData));
  }
  req.end();
};

// get user doc
// cb = function(err, doc)
// If not found, doc === null
exports.getDoc = function(_id, cb) {
  var options = {
      hostname: 'localhost',
      auth: 'admin:1234',
      port: 5984,
      path: '/users/' + _id, 
      method: 'GET'
  };
  if (_id.length === 0) cb(null, null);
  send(options, null, function(err, result) {
    if (err) {
      cb(err);
    } else if (result.error) {
      if (result.error === 'not_found') {
        cb(null, null);
      } else {
        cb(new Error(result.error));
      }
    } else {
      cb(null, result);
    }
  });
};

// write the new version of given user doc
// cb = function(err, result)
//   On bad revision string,  result.old === true 
//   On success, result.rev contains new revision string.
exports.updateDoc = function(doc, cb) {
  var options = {
      hostname: 'localhost',
      auth: 'admin:1234',
      port: 5984,
      path: '/users/' + doc._id, 
      method: 'PUT'
  };
  send(options, doc, function(err, result) {
    if (err) {
      cb(err);
    } else if (result.error) {
      if (result.error === 'conflict') {
        cb(null, { old: true });
      } else {
        cb(new Error(result.error));
      }
    } else if (result.ok) {
      cb(null, { rev: result.rev });
    } else {
      console.log('unexpected in db.updateDoc: ' + JSON.stringify(result));
      cb(new Error('unexpected'));
    }
  });
};

