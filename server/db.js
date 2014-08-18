var pg = require('pg');

var url = 'postgres://localhost/gems'; // or 'postgres://postgres@localhost/gems'

exports.init = function(cb) {
  pg.connect(url, function(err, client, done) {
    if (err) throw err;
    client.query("select * from users where id = 'a'", function (err, result) {
      done();
      if (err) throw err;
      cb();
    })
  });
};

exports.getDoc = function(id, cb) {
  pg.connect(url, function(err, client, done) {
    if (err) return cb(err);
    client.query('select * from users where id = $1', [id], function (err, result) {
      done();
      if (err) return cb(err);
      if (result.rows.length === 0) {
        return cb(null, null);
      }
      cb(null, result.rows[0]);
    });
  });
};

exports.updateDoc = function(doc, cb) {
  pg.connect(url, function(err, client, done) {
    if (err) return cb(err);
    var nextRev = (parseInt(doc.rev) + 1).toString();
    client.query("update users set balance = $1, gems = $2, score = $3, rev = $4 where id = $5 and rev = $6",
                 [doc.balance, doc.gems, doc.score, nextRev, doc.id, doc.rev],
                 function (err, result) {
      done();
      if (err) {
        cb(err);
      } else if (result.rowCount === 0) {
        // Assume the doc is there. If it's not, next request from client will not authenticate.
        cb(null, { old: true });
      } else {
        cb(null, { rev: nextRev });
      }
    });
  });
};

