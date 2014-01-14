var http        = require('http');
var querystring = require('querystring');
var db          = require('./db');
var reply       = require('./response').reply;
var replyError  = require('./response').replyError;
var replyLogin  = require('./response').replyLogin;

// This function extracts a JSON-encoded object from the request message.
// If number of bytes received exceeds maxBytes or any other problem occurs,
// then assume malicious client and destroy socket. 
// cb = function(data)
var extractData =
exports.extractData = function(req, maxBytes, cb) {
  var dataString;
  req.setEncoding('utf8'); // Causes chunks to be strings.
  req.on('data', function (chunk) {
    if (dataString === undefined) {
      dataString = chunk;
    } else {
      dataString += chunk;
    }
    if (dataString.length > maxBytes) {
      console.log('maxBytes exceeded for incoming message');
      req.socket.destroy();
      return;
    }
  });
  req.on('end', function() {
    if (dataString === undefined || dataString.length === 0) return cb({});
    var data;
    try {
      data = JSON.parse(dataString);
    } catch (err) {
      console.log('parse error for message body = ' + dataString);
      console.log(err.message);
      req.socket.destroy();
      return;
    }
    if (typeof(data) === 'object') {
      cb(data);
    } else {
      console.log('WARNING: body is cwnot an object for message body = ' + dataString);
      req.socket.destroy();
    }
  });
};

// Check that the given fields are properites of data and are nonempty strings.
// If any field is missing, assume malicious client and destroy socket.
exports.checkStringParameters = function(data, fields, req, cb) {
  for(var i = 0; i < fields.length; i++) {
    if (!data.hasOwnProperty(fields[i]) || typeof data[fields[i]] !== 'string') {
      console.log('Fields ' + JSON.stringify(fields) + ' bad in ' + JSON.stringify(data));
      req.socket.destroy();
      return;
    }
  }
  cb();
};

// Check that the given fields are properties of data.
// If any field is missing, assume malicious client and destroy socket.
exports.checkParameters = function(data, fields, req, cb) {
  for(var i = 0; i < fields.length; i++) {
    if (!data.hasOwnProperty(fields[i])){
      console.log('Fields ' + JSON.stringify(fields) + ' bad in ' + JSON.stringify(data));
      req.socket.destroy();
      return;
    }	
  }
  cb();
};

// Retrieve user doc; verify that user exists and password is correct.
exports.checkPassword = function(userId, password, res, cb) {
  db.getDoc(userId, function(err, doc) {
    if (err) {
      console.log(err.message);
      replyError(res);
    } else if (doc === null) {
      replyLogin(res);
    } else if (doc.pw !== password) {
      replyLogin(res);
    } else {
      cb(doc);
    }
  });
};

// Check document revision.
// If revision is old, then return current doc to client.
exports.checkRevision = function(doc, revision, res, cb) {
  if (doc._rev !== revision) {
    return reply(res, { 'old': true, doc: doc });
  }
  cb();
};


