var parse = require('./request').parse;
var check = require('./request').check;
var reply = require('./response').reply;
var replyError = require('./response').replyError;
var replyLogin = require('./response').replyLogin;
var db = require('./db');

exports.handle = function(req, res) {
  parse(req, 256, function(err, reqData) {
    if (err) return replyError(res);
    check(reqData, ['_id', 'pw'], req, function() {
      db.getDoc(reqData._id, function(err, doc) {
        if (err) {
          console.log(err.message);
          return replyError(res);
        }
        if (doc.pw !== reqData.pw) {
          return replyLogin(res);
        }
        reply(res, {doc: doc});
      });
    });
  });
};

