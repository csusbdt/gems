var extractData           = require('./request').extractData;
var checkStringParameters = require('./request').checkStringParameters;
var checkPassword         = require('./request').checkPassword;
var reply                 = require('./response').reply;

exports.handle = function(req, res) {
  // Pass request through appropriate filters before performing end goal processing.
  extractData(req, 256, function(data) {
    checkStringParameters(data, ['_id', 'pw'], req, function() {
      checkPassword(data._id, data.pw, res, function(userDoc) {
        processRequest(userDoc, res);
      });
    });
  });
};

function processRequest(userDoc, res) {
  reply(res, { doc: userDoc });
}

