var extractData           = require('./request').extractData;
var checkStringParameters = require('./request').checkStringParameters;
var checkPassword         = require('./request').checkPassword;
var getUserdoc            = require('./request').getUserdoc;
var reply                 = require('./response').reply;

exports.handle = function(req, res) {
  // Pass request through appropriate filters before performing end goal processing.
  extractData(req, 256, function(data) {
    checkStringParameters(data, ['id', 'pw'], req, function() {
      getUserdoc(data.id, res, function(userDoc) {
        checkPassword(userDoc, data.pw, res, function() {
          processRequest(userDoc, res);
        });
      });
    });
  });
};

function processRequest(userDoc, res) {
  reply(res, { doc: userDoc });
}

