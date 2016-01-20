/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  save: function(data, callback) {
    if (data.discountcoupon && data.discountcoupon != "") {
      data.discountcoupon = sails.ObjectID(data.discountcoupon);
    }
    if (data.cart && data.cart.length > 0) {
      _.each(data.cart, function(art) {
        art._id = sails.ObjectID(art._id);
      });
    }
    if (data.user) {
      data.user = sails.ObjectID(data.user);
    }
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        if (!data._id) {
          var newdata = {};
          newdata.grantTotal = data.grantTotal;
          newdata.subTotal = data.subTotal;
          newdata.packing = data.packing;
          newdata.vat = data.vat;
          newdata.comment = data.comment;
          newdata.status = "Pending";
          newdata._id = sails.ObjectID();
          newdata.cart = data.cart;
          newdata.orderid = "#O";
          newdata.timestamp = new Date();
          newdata.name = data.name;
          newdata.email = data.email;
          var possible = "0123456789";
          for (var i = 0; i < 8; i++) {
            newdata.orderid += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          newdata.user = data.user;
          db.collection('order').insert(newdata, function(err, created) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (created) {
              if (data.orderid && data.orderid.length > 0) {
                data.orderid.push({
                  _id: newdata._id
                });
              } else {
                data.orderid = [];
                data.orderid.push({
                  _id: newdata._id
                });
              }
              data._id = data.user;
              data.cart = [];
              delete data.form;
              delete data.user;
              delete data.subTotal;
              delete data.grantTotal;
              delete data.packing;
              delete data.vat;
              delete data.comment;
              User.save(data, function(userespo) {
                callback({
                  id: newdata._id
                });
              });
            } else {
              callback({
                value: false,
                comment: "Not created"
              });
              db.close();
            }
          });
        } else {
          var order = sails.ObjectID(data._id);
          delete data._id;
          db.collection('order').update({
            _id: order
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
  saveGuest: function(data, callback) {
    if (data.discountcoupon && data.discountcoupon != "") {
      data.discountcoupon = sails.ObjectID(data.discountcoupon);
    }
    if (data.cart && data.cart.length > 0) {
      _.each(data.cart, function(art) {
        art._id = sails.ObjectID(art._id);
      });
    }
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        if (!data._id) {
          data.status = "Pending";
          data._id = sails.ObjectID();
          data.orderid = "#O";
          data.timestamp = new Date();
          var possible = "0123456789";
          for (var i = 0; i < 8; i++) {
            data.orderid += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          data.name = data.billing.name;
          data.email = data.billing.email;
          data.mobileno = data.billing.mobileno;
          callme();
          function callme(){
          db.collection('order').insert(data, function(err, created) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (created) {
              callback({
                id: data._id
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "Not created"
              });
              db.close();
            }
          });
        }
        } else {
          var order = sails.ObjectID(data._id);
          delete data._id;
          db.collection('order').update({
            _id: order
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
    var newcallback = 0;
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
      }
      if (db) {
        db.collection("order").count({
          _id: {
            $exists: true
          }
        }, function(err, number) {
          if (number && number != "") {
            newreturns.total = number;
            newreturns.totalpages = Math.ceil(number / data.pagesize);
            callbackfunc();
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

        function callbackfunc() {
          db.collection("order").find({
            _id: {
              $exists: true
            }
          }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
            if (err) {
              callback({
                value: false
              });
              console.log(err);
              db.close()
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
      }
      if (db) {
        db.collection("order").find({
          user: sails.ObjectID(data.user)
        }).toArray(function(err, data2) {
          if (data2 && data2[0]) {
            callback(data2);
            db.close();
          } else if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else {
            callback([]);
            db.close();
          }
        });
      }
    });
  },
  findOrders: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("order").find({
          user: sails.ObjectID(data.user)
        }, {
          user: 0
        }).toArray(function(err, data2) {
          if (data2 && data2[0]) {
            callback(data2);
          } else if (err) {
            console.log(err);
            callback({
              value: false
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
      }
      if (db) {
        db.collection("order").find({
          _id: sails.ObjectID(data._id)
        }, {
          user: 0
        }).toArray(function(err, data2) {
          if (data2 && data2[0]) {
            callback(data2[0]);
          } else if (err) {
            console.log(err);
            callback({
              value: false
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
      }
      db.collection('order').remove({
        _id: sails.ObjectID(data._id)
      }, function(err, deleted) {
        if (deleted) {
          callback({
            value: true
          });
          db.close();
        } else if (err) {
          console.log(err);
          callback({
            value: false
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
    });
  },
  editOrder: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        var order = sails.ObjectID(data._id);
        delete data._id;
        db.collection('order').update({
          _id: order
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
    });
  }
};
