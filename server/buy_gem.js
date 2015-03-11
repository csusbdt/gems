var extractData           = require('./request').extractData;
var checkStringParameters = require('./request').checkStringParameters;
var checkPassword         = require('./request').checkPassword;
var checkRevision         = require('./request').checkRevision;
var getUserdoc            = require('./request').getUserdoc;
var reply                 = require('./response').reply;
var replyError            = require('./response').replyError;
var updateDoc             = require('./db').updateDoc;

exports.handle = function(req, res) {
  // Pass request through appropriate filters before performing end goal processing.
  extractData(req, 256, function(data) {
    checkStringParameters(data, ['id', 'rev', 'pw'], req, function() {
      getUserdoc(data.id, res, function(userDoc) {
        checkPassword(userDoc, data.pw, res, function() {
          checkRevision(userDoc, data.rev, res, function() {
            processRequest(userDoc, res);
          });
        });
      });
    });
  });
};

function processRequest(userDoc, res) {
  if (userDoc.balance <= 0) {
    return reply(res, { 'insufficientBalance': true });
  }
  --userDoc.balance;
  ++userDoc.gems;
  updateDoc(userDoc, function(err, result) {
    if (err) {
      console.log(err.message);
      replyError(res);
    } else if (result.old) {
      processOld(userDoc, res);
    } else if (result.rev) {
      userDoc.rev = result.rev;
      reply(res, { doc: userDoc });
    } else {
      console.log('logic error');
      replyError(res);
    }
  });
};

function processOld(oldDoc, res) {
  // Get a fresh version of the doc and return it to the client.
  getUserdoc(oldDoc.id, res, function(newDoc) {
    reply(res, { old: true, doc: newDoc });
  });
}

