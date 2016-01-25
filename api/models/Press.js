/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  save: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {

        if (!data._id) {
          data._id = sails.ObjectID();
          db.collection('press').insert(data, function(err, created) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (created) {
              callback({
                value: true
              });
              db.close();
            } else {
              callback({
                value: false,
                commment: "Not created"
              });
              db.close();
            }
          });
        } else {
          var press = sails.ObjectID(data._id);
          delete data._id;
          db.collection('press').update({
            _id: press
          }, {
            $set: data
          }, function(err, updated) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
              callback({
                value: true
              });
              db.close();
            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
              callback({
                value: true,
                comment: "Data already updated"
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        }
      }
    });
  },
  findlimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var pagesize = data.pagesize;
    var pagenumber = data.pagenumber;
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection("press").count({
          title: {
            '$regex': check
          }
        }, function(err, number) {
          if (number && number != "") {
            newreturns.total = number;
            newreturns.totalpages = Math.ceil(number / data.pagesize);
            callbackfunc1();
          } else if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else {
            callback({
              value: false,
              comment: "Count of null"
            });
            db.close();
          }
        });

        function callbackfunc1() {
          db.collection("press").find({
            title: {
              '$regex': check
            }
          }).skip(pagesize * (pagenumber - 1)).sort({
            year: -1
          }).limit(pagesize).toArray(function(err, found) {
            if (err) {
              callback({
                value: false
              });
              console.log(err);
              db.close();
            } else if (found && found[0]) {
              newreturns.data = found;
              callback(newreturns);
              db.close();
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        }
      }
    });
  },
  find: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection("press").find({}, {}).sort({
          date: -1
        }).toArray(function(err, found) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (found && found[0]) {
            callback(found);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  findone: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection("press").find({
          _id: sails.ObjectID(data._id)
        }, {}).toArray(function(err, found) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (found && found[0]) {
            callback(found[0]);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  delete: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection('press').remove({
          _id: sails.ObjectID(data._id)
        }, function(err, deleted) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (deleted) {
            callback({
              value: true
            });
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  }
};
