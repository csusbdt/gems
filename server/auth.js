var parse = require('./request').parse;
var check = require('./request').check;
var reply = require('./response').reply;
var replyError = require('./response').replyError;
var replyLogin = require('./response').replyLogin;
var db = require('./db');

exports.handle = function(req, res) {
  parse(req, 256, function(err, reqData) {
    if (err) return replyError(res);
    check(reqData, ['_id', '_rev', 'pw'], req, function() {
      db.getDoc(reqData._id, function(err, doc) {
        if (err) {
          console.log(err.message);
          return replyError(res);
        }
        if (doc.pw !== reqData.pw) {
          return replyLogin(res);
        }
        if (doc._rev !== reqData._rev) {
          return reply(res, { 'old': true, doc: doc });
        }
        if (doc.balance <= 0) {
          return reply(res, { 'insufficientBalance': true });
        }
        --doc.balance;
        ++doc.gems;
        db.updateDoc(doc, function(err, result) {
          if (err) {
            console.log(err.message);
            return replyError(res);
          }
          if (result.error) {
            return replyError(res);
          }
          if (result.old) {
            return reply(res, { old: true });
          }
          doc._rev = result.rev;
          reply(res, { doc: doc });
        });
      });
    });
  });
};

