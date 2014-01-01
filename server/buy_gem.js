var extractData           = require('./request').extractData;
var checkStringParameters = require('./request').checkStringParameters;
var checkPassword         = require('./request').checkPassword;
var checkRevision         = require('./request').checkRevision;
var reply                 = require('./response').reply;
var replyError            = require('./response').replyError;
var updateDoc             = require('./db').updateDoc;

exports.handle = function(req, res) {
  extractData(req, 256, function(data) {
    checkStringParameters(data, ['_id', '_rev', 'pw'], req, function() {
      checkPassword(data._id, data.pw, res, function(userDoc) {
        checkRevision(userDoc, data._rev, res, function() {
          processRequest(userDoc, res);
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
    } else if (result.error) {
      if (result.error === 'conflict') {
        processConflict(userDoc, res);
      } else {
        console.log(result.err);
        replyError(res);
      }
    } else if (result.rev) {
      userDoc._rev = result.rev;
      reply(res, { doc: userDoc }); // can change this to return rev number instead of entire doc
    } else {
      console.log('unexpected error');
      replyError(res);
    }
  });
};

function processConflict(oldDoc, res) {
  checkPassword(oldDoc._id, oldDoc.pw, res, function(newDoc) {
    reply(res, { old: true, doc: newDoc });
  });
}

