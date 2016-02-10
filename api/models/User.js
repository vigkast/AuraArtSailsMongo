  /**
   * User.js
   *
   * @description :: TODO: You might write a short summary of how this model works and what it represents here.
   * @docs        :: http://sailsjs.org/#!documentation/models
   */
  module.exports = {
      findorcreate: function(data, callback) {
          var orfunc = {};
          var insertdata = {};
          if (data.provider == "Twitter") {
              insertdata.tweetid = data.id;
              insertdata.accesslevel = "customer";
              insertdata.provider = data.provider;
              insertdata.username = data.username;
              insertdata.name = data.displayName;
              if (data.photos[0]) {
                  insertdata.profilepic = data.photos[0].value;
              }
              insertdata.token = data.token;
              insertdata.tokenSecret = data.tokenSecret;
              orfunc.tweetid = data.id;
              dbcall(insertdata);
          } else if (data.provider == "Facebook") {
              insertdata.fbid = data.id;
              insertdata.accesslevel = "customer";
              insertdata.provider = data.provider;
              insertdata.username = data.username;
              insertdata.name = data.displayName;
              if (data.photos && data.photos[0]) {
                  insertdata.profilepic = data.photos[0].value;
              }
              if (data.emails && data.emails[0]) {
                  insertdata.email = data.emails[0].value;
              }
              insertdata.accessToken = data.accessToken;
              insertdata.refreshToken = data.refreshToken;
              orfunc.fbid = data.id;
              dbcall(insertdata);
          } else {
              insertdata.googleid = data.id;
              insertdata.accesslevel = "customer";
              insertdata.provider = data.provider;
              insertdata.name = data.displayName;
              if (data.photos && data.photos[0]) {
                  insertdata.profilepic = data.photos[0].value;
              }
              if (data.emails && data.emails[0]) {
                  insertdata.email = data.emails[0].value;
              }
              insertdata.token = data.token;
              orfunc.googleid = data.id;
              dbcall(insertdata);
          }

          function dbcall(data) {
              sails.query(function(err, db) {
                  if (err) {
                      callback({
                          value: false
                      });
                  }
                  data._id = sails.ObjectID();
                  db.collection('user').find(orfunc).toArray(function(err, found) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (found.length != 0 && found[0]) {
                          var data2 = found[0];
                          data2.id = found[0]._id;
                          delete data2.accessToken;
                          delete data2.token;
                          delete data2.tokenSecret;
                          delete data2.gallery;
                          delete data2.post;
                          callback(null, data2);
                          db.close();
                      } else {
                          db.collection('user').insert(data, function(err, created) {
                              if (err) {
                                  console.log(err);
                                  callback({
                                      value: false
                                  });
                                  db.close();
                              } else if (created) {
                                  if (data.email && data.email != "") {
                                      var obj = {
                                          "api_key": "47e02d2b10604fc81304a5837577e286",
                                          "email_details": {
                                              "fromname": sails.fromName,
                                              "subject": "Registration at www.auraart.in",
                                              "from": sails.fromEmail,
                                              "replytoid": data.email
                                          },
                                          "settings": {
                                              "template": "2336",
                                          },
                                          "recipients": [data.email],
                                          "attributes": {
                                              "NAME": [data.name],
                                              "EMAIL": [data.email]
                                          }
                                      };
                                      sails.request.get({
                                          url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                                      }, function(err, httpResponse, body) {
                                          if (err) {
                                              callback({
                                                  value: false
                                              });
                                              db.close();
                                          } else if (body && body == "success") {
                                              data.id = created.ops[0]._id;
                                              delete data.accessToken;
                                              delete data.token;
                                              delete data.tokenSecret;
                                              callback(null, data);
                                              db.close();
                                          } else {
                                              callback({
                                                  value: false,
                                                  comment: "Error"
                                              });
                                              db.close();
                                          }
                                      });
                                  } else {
                                      data.id = created.ops[0]._id;
                                      delete data.accessToken;
                                      delete data.token;
                                      delete data.tokenSecret;
                                      callback(null, data);
                                      db.close();
                                  }
                              } else {
                                  callback({
                                      value: false,
                                      comment: "Not created"
                                  });
                                  db.close();
                              }
                          });
                      }
                  });
              });
          }
      },
      adminlogin: function(data, callback) {
          if (data.password) {
              data.password = sails.md5(data.password);
              sails.query(function(err, db) {
                  if (db) {
                      db.collection('user').find({
                          email: data.email,
                          password: data.password,
                          accesslevel: "admin"
                      }, {
                          password: 0,
                          forgotpassword: 0
                      }).toArray(function(err, found) {
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
                  if (err) {
                      console.log(err);
                      callback({
                          value: false
                      });
                  }
              });
          } else {
              callback({
                  value: false
              });
          }
      },
      save: function(data, callback) {
          if (data.cart && data.cart.length > 0) {
              _.each(data.cart, function(q) {
                  q.artwork = sails.ObjectID(q.artwork);
                  q._id = sails.ObjectID(q._id);
              });
          }
          if (data.wishlist && data.wishlist.length > 0) {
              _.each(data.wishlist, function(n) {
                  n.artwork = sails.ObjectID(n.artwork);
                  n._id = sails.ObjectID(n._id);
              });
          }
          if (data.wishlistfolder && data.wishlistfolder.length > 0) {
              _.each(data.wishlistfolder, function(f) {
                  f._id = sails.ObjectID(f._id);
              });
          }
          if (data.medium && data.medium.length > 0) {
              _.each(data.medium, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.theme && data.theme.length > 0) {
              _.each(data.theme, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.reseller && data.reseller.length > 0) {
              _.each(data.reseller, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          delete data.artwork;
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  if (data.password && data.password != "") {
                      data.password = sails.md5(data.password);
                  }

                  function saveuser(data) {
                      db.collection('user').insert(data, function(err, created) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (created) {
                              if (data.accesslevel == "artist") {
                                  delete data.password;
                                  callback(data);
                                  db.close();
                              } else {
                                  var obj = {
                                      "api_key": "47e02d2b10604fc81304a5837577e286",
                                      "email_details": {
                                          "fromname": sails.fromName,
                                          "subject": "Registration at www.auraart.in",
                                          "from": sails.fromEmail,
                                          "replytoid": data.email
                                      },
                                      "settings": {
                                          "template": "2336",
                                      },
                                      "recipients": [data.email],
                                      "attributes": {
                                          "NAME": [data.name],
                                          "EMAIL": [data.email]
                                      }
                                  };
                                  sails.request.get({
                                      url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                                  }, function(err, httpResponse, body) {
                                      if (err) {
                                          callback({
                                              value: false
                                          });
                                          db.close();
                                      } else if (body && body == "success") {
                                          delete data.password;
                                          data.id = data._id;
                                          callback(data);
                                          db.close();
                                      } else {
                                          callback({
                                              value: false,
                                              comment: "Error"
                                          });
                                          db.close();
                                      }
                                  });
                              }
                          } else {
                              callback({
                                  value: false,
                                  comment: "Not created"
                              });
                              db.close();
                          }
                      });
                  }
                  if (!data._id) {
                      if (data.accesslevel == "artist") {
                          saveuser(data);
                      } else {
                          data._id = sails.ObjectID();
                          if (data.email && data.email != "") {
                              db.collection("user").find({
                                  email: data.email
                              }).toArray(function(err, data2) {
                                  if (err) {
                                      console.log(err);
                                      callback({
                                          value: false,
                                          comment: "Error"
                                      });
                                      db.close();
                                  } else if (data2 && data2[0]) {
                                      callback({
                                          value: false,
                                          comment: "User already exists"
                                      });
                                      db.close();
                                  } else {
                                      saveuser(data);
                                  }
                              });
                          } else {
                              callback({
                                  value: false,
                                  comment: "Please provide parmeters"
                              });
                              db.close();
                          }
                      }
                  } else {
                      var user = sails.ObjectID(data._id);
                      delete data._id;
                      db.collection("user").update({
                          _id: user
                      }, {
                          $set: data
                      }, function(err, updated) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (updated) {
                              data.id = user;
                              data._id = user;
                              callback(data);
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
          var checkfor = new RegExp(data.search, "i");
          var accesslevel = data.accesslevel;
          var pagesize = parseInt(data.pagesize);
          var pagenumber = parseInt(data.pagenumber);
          var sortnum = parseInt(data.sort);
          var sort = {};
          sort[data.filter] = sortnum;
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  if (accesslevel == "artist") {
                      var matchobj = {
                          $or: [{
                              name: {
                                  '$regex': checkfor
                              }
                          }, {
                              email: {
                                  '$regex': checkfor
                              }
                          }],
                          status: data.status,
                          accesslevel: accesslevel,
                          "artwork.type": data.type
                      };
                      callbackfunc1();
                  } else if (accesslevel == "admin") {
                      var matchobj = {
                          $or: [{
                              name: {
                                  '$regex': checkfor
                              }
                          }, {
                              email: {
                                  '$regex': checkfor
                              }
                          }],
                          accesslevel: accesslevel
                      };
                      callbackfunc1();
                  } else {
                      var matchobj = {
                          $and: [{
                              $or: [{
                                  name: {
                                      '$regex': checkfor
                                  }
                              }, {
                                  email: {
                                      '$regex': checkfor
                                  }
                              }]
                          }, {
                              $or: [{
                                  accesslevel: "customer"
                              }, {
                                  accesslevel: "reseller"
                              }]
                          }]
                      };
                      callbackfunc1();
                  }

                  function callbackfunc1() {
                      if (!data.status || data.status == "" || data.status == "All") {
                          delete matchobj.status;
                      }
                      if (!data.type || data.type == "") {
                          delete matchobj["artwork.type"];
                      }
                      db.collection("user").count(matchobj, function(err, number) {
                          if (number && number != "") {
                              newreturns.total = number;
                              newreturns.totalpages = Math.ceil(number / data.pagesize);
                              callbackfunc();
                          } else if (err) {
                              console.log(err);
                              callback({
                                  value: false
                              });
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
                          db.collection("user").find(matchobj, {
                              password: 0,
                              forgotpassword: 0
                          }, {
                              sort: sort
                          }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
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
                  db.collection("user").find({}, {
                      password: 0,
                      forgotpassword: 0
                  }).toArray(function(err, found) {
                      if (err) {
                          callback({
                              value: false
                          });
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
      findbyletter: function(data, callback) {
          var newreturns = {};
          newreturns.data = [];
          var spacedata = data.searchname;
          spacedata = "\\s" + spacedata;
          var checkname = new RegExp(spacedata, "i");
          data.searchname = "^" + data.searchname;
          var checkspace = new RegExp(data.searchname, "i");
          data.search = "^" + data.search;
          var check = new RegExp(data.search, "i");
          var firstmatch = {
              $and: [{
                  name: check
              }, {
                  $or: [{
                      name: {
                          '$regex': checkname
                      }
                  }, {
                      name: {
                          '$regex': checkspace
                      }
                  }]
              }],
              status: "approve",
              accesslevel: "artist",
              "artwork.type": data.type
          };
          callbackfunc1();

          function callbackfunc1() {
              if (!data.type || data.type == "") {
                  delete firstmatch["artwork.type"];
              }
              sails.query(function(err, db) {
                  if (err) {
                      console.log(err);
                      callback({
                          value: false
                      });
                  }
                  if (db) {
                      db.collection("user").find(firstmatch, {
                          password: 0,
                          forgotpassword: 0
                      }).sort({
                          focused: 1,
                          name: 1
                      }).toArray(function(err, found) {
                          if (err) {
                              callback({
                                  value: false
                              });
                              console.log(err);
                          } else if (found && found[0]) {
                              newreturns.data = found;
                              callback(newreturns);
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
                  db.collection("user").find({
                      _id: sails.ObjectID(data._id)
                  }, {
                      password: 0,
                      forgotpassword: 0
                  }).toArray(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2[0]) {
                          delete data2[0].password;
                          callback(data2[0]);
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
      findoneBack: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").find({
                      _id: sails.ObjectID(data._id)
                  }, {
                      password: 0,
                      forgotpassword: 0
                  }).toArray(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2[0]) {
                          delete data2[0].password;
                          callback(data2[0]);
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
      findoneArtist: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  User.findone(data, function(respo) {
                      if (respo.value != false) {
                          if (respo.artwork && respo.artwork.length > 0) {
                              db.collection("user").aggregate([{
                                  $match: {
                                      _id: sails.ObjectID(data._id)
                                  }
                              }, {
                                  $unwind: "$artwork"
                              }, {
                                  $match: {
                                      $or: [{
                                          "artwork.status": "approve"
                                      }, {
                                          "artwork.status": "sold"
                                      }]
                                  }
                              }, {
                                  $group: {
                                      _id: sails.ObjectID(data._id),
                                      artwork: {
                                          $addToSet: "$artwork"
                                      },
                                      name: {
                                          $addToSet: "$name"
                                      },
                                      artistdesc: {
                                          $addToSet: "$artistdesc"
                                      },
                                      residence: {
                                          $addToSet: "$residence"
                                      },
                                      personal: {
                                          $addToSet: "$personal"
                                      },
                                      work: {
                                          $addToSet: "$work"
                                      },
                                      other: {
                                          $addToSet: "$other"
                                      },
                                      medium: {
                                          $addToSet: "$medium"
                                      },
                                      theme: {
                                          $addToSet: "$theme"
                                      },
                                      selleremail: {
                                          $addToSet: "$selleremail"
                                      },
                                      gender: {
                                          $addToSet: "$gender"
                                      },
                                      email: {
                                          $addToSet: "$email"
                                      },
                                      dob: {
                                          $addToSet: "$dob"
                                      },
                                      stateofb: {
                                          $addToSet: "$stateofb"
                                      },
                                      passedaway: {
                                          $addToSet: "$passedaway"
                                      },
                                      adcer: {
                                          $addToSet: "$adcer"
                                      },
                                      edu: {
                                          $addToSet: "$edu"
                                      },
                                      soloshow: {
                                          $addToSet: "$soloshow"
                                      },
                                      groupshow: {
                                          $addToSet: "$groupshow"
                                      },
                                      award: {
                                          $addToSet: "$award"
                                      },
                                      auction: {
                                          $addToSet: "$auction"
                                      },
                                      woa: {
                                          $addToSet: "$woa"
                                      },
                                      pricing: {
                                          $addToSet: "$pricing"
                                      },
                                      galleries: {
                                          $addToSet: "$galleries"
                                      },
                                      clink: {
                                          $addToSet: "$clink"
                                      },
                                      eblink: {
                                          $addToSet: "$eblink"
                                      },
                                      accesslevel: {
                                          $addToSet: "$accesslevel"
                                      },
                                      accesslevel: {
                                          $addToSet: "$accesslevel"
                                      },
                                      status: {
                                          $addToSet: "$status"
                                      },
                                      reseller: {
                                          $addToSet: "$reseller"
                                      },
                                      resume: {
                                          $addToSet: "$resume"
                                      },
                                      comment: {
                                          $addToSet: "$comment"
                                      },
                                      image: {
                                          $addToSet: "$image"
                                      }
                                  }
                              }, {
                                  $project: {
                                      _id: 1,
                                      name: 1,
                                      artistdesc: {
                                          $cond: [{
                                                  $eq: ["$artistdesc", []]
                                              },
                                              [""], "$artistdesc"
                                          ]
                                      },
                                      residence: {
                                          $cond: [{
                                                  $eq: ["$residence", []]
                                              },
                                              [""], "$residence"
                                          ]
                                      },
                                      personal: {
                                          $cond: [{
                                                  $eq: ["$personal", []]
                                              },
                                              [""], "$personal"
                                          ]
                                      },
                                      work: {
                                          $cond: [{
                                                  $eq: ["$work", []]
                                              },
                                              [""], "$work"
                                          ]
                                      },
                                      other: {
                                          $cond: [{
                                                  $eq: ["$other", []]
                                              },
                                              [""], "$other"
                                          ]
                                      },
                                      medium: {
                                          $cond: [{
                                                  $eq: ["$medium", []]
                                              },
                                              [""], "$medium"
                                          ]
                                      },
                                      theme: {
                                          $cond: [{
                                                  $eq: ["$theme", []]
                                              },
                                              [""], "$theme"
                                          ]
                                      },
                                      selleremail: {
                                          $cond: [{
                                                  $eq: ["$selleremail", []]
                                              },
                                              [""], "$selleremail"
                                          ]
                                      },
                                      gender: {
                                          $cond: [{
                                                  $eq: ["$gender", []]
                                              },
                                              [""], "$gender"
                                          ]
                                      },
                                      email: {
                                          $cond: [{
                                                  $eq: ["$email", []]
                                              },
                                              [""], "$email"
                                          ]
                                      },
                                      dob: {
                                          $cond: [{
                                                  $eq: ["$dob", []]
                                              },
                                              [""], "$dob"
                                          ]
                                      },
                                      stateofb: {
                                          $cond: [{
                                                  $eq: ["$stateofb", []]
                                              },
                                              [""], "$stateofb"
                                          ]
                                      },
                                      passedaway: {
                                          $cond: [{
                                                  $eq: ["$passedaway", []]
                                              },
                                              [""], "$passedaway"
                                          ]
                                      },
                                      adcer: {
                                          $cond: [{
                                                  $eq: ["$adcer", []]
                                              },
                                              [""], "$adcer"
                                          ]
                                      },
                                      edu: {
                                          $cond: [{
                                                  $eq: ["$edu", []]
                                              },
                                              [""], "$edu"
                                          ]
                                      },
                                      soloshow: {
                                          $cond: [{
                                                  $eq: ["$soloshow", []]
                                              },
                                              [""], "$soloshow"
                                          ]
                                      },
                                      groupshow: {
                                          $cond: [{
                                                  $eq: ["$groupshow", []]
                                              },
                                              [""], "$groupshow"
                                          ]
                                      },
                                      award: {
                                          $cond: [{
                                                  $eq: ["$award", []]
                                              },
                                              [""], "$award"
                                          ]
                                      },
                                      auction: {
                                          $cond: [{
                                                  $eq: ["$auction", []]
                                              },
                                              [""], "$auction"
                                          ]
                                      },
                                      woa: {
                                          $cond: [{
                                                  $eq: ["$woa", []]
                                              },
                                              [""], "$woa"
                                          ]
                                      },
                                      pricing: {
                                          $cond: [{
                                                  $eq: ["$pricing", []]
                                              },
                                              [""], "$pricing"
                                          ]
                                      },
                                      galleries: {
                                          $cond: [{
                                                  $eq: ["$galleries", []]
                                              },
                                              [""], "$galleries"
                                          ]
                                      },
                                      clink: {
                                          $cond: [{
                                                  $eq: ["$clink", []]
                                              },
                                              [""], "$clink"
                                          ]
                                      },
                                      eblink: {
                                          $cond: [{
                                                  $eq: ["$eblink", []]
                                              },
                                              [""], "$eblink"
                                          ]
                                      },
                                      accesslevel: {
                                          $cond: [{
                                                  $eq: ["$accesslevel", []]
                                              },
                                              [""], "$accesslevel"
                                          ]
                                      },
                                      status: {
                                          $cond: [{
                                                  $eq: ["$status", []]
                                              },
                                              [""], "$status"
                                          ]
                                      },
                                      reseller: {
                                          $cond: [{
                                                  $eq: ["$reseller", []]
                                              },
                                              [""], "$reseller"
                                          ]
                                      },
                                      resume: {
                                          $cond: [{
                                                  $eq: ["$resume", []]
                                              },
                                              [""], "$resume"
                                          ]
                                      },
                                      comment: {
                                          $cond: [{
                                                  $eq: ["$comment", []]
                                              },
                                              [""], "$comment"
                                          ]
                                      },
                                      image: {
                                          $cond: [{
                                                  $eq: ["$image", []]
                                              },
                                              [""], "$image"
                                          ]
                                      },
                                      artwork: 1
                                  }
                              }, {
                                  $unwind: "$name"
                              }, {
                                  $unwind: "$artistdesc"
                              }, {
                                  $unwind: "$residence"
                              }, {
                                  $unwind: "$work"
                              }, {
                                  $unwind: "$personal"
                              }, {
                                  $unwind: "$other"
                              }, {
                                  $unwind: "$medium"
                              }, {
                                  $unwind: "$theme"
                              }, {
                                  $unwind: "$selleremail"
                              }, {
                                  $unwind: "$gender"
                              }, {
                                  $unwind: "$email"
                              }, {
                                  $unwind: "$dob"
                              }, {
                                  $unwind: "$passedaway"
                              }, {
                                  $unwind: "$stateofb"
                              }, {
                                  $unwind: "$adcer"
                              }, {
                                  $unwind: "$edu"
                              }, {
                                  $unwind: "$soloshow"
                              }, {
                                  $unwind: "$groupshow"
                              }, {
                                  $unwind: "$award"
                              }, {
                                  $unwind: "$auction"
                              }, {
                                  $unwind: "$woa"
                              }, {
                                  $unwind: "$pricing"
                              }, {
                                  $unwind: "$galleries"
                              }, {
                                  $unwind: "$clink"
                              }, {
                                  $unwind: "$eblink"
                              }, {
                                  $unwind: "$accesslevel"
                              }, {
                                  $unwind: "$status"
                              }, {
                                  $unwind: "$reseller"
                              }, {
                                  $unwind: "$resume"
                              }, {
                                  $unwind: "$comment"
                              }, {
                                  $unwind: "$image"
                              }]).toArray(function(err, data2) {
                                  if (err) {
                                      console.log(err);
                                      callback({
                                          value: false
                                      });
                                      db.close();
                                  } else if (data2 && data2[0]) {
                                      callback(data2[0]);
                                      db.close();
                                  } else {
                                      callback({
                                          value: false,
                                          comment: "No data found"
                                      });
                                      db.close();
                                  }
                              });
                          } else {
                              callback(respo);
                              db.close();
                          }
                      } else {
                          callback({
                              value: false,
                              comment: "Artist does not exist"
                          });
                          db.close();
                      }
                  });
              }
          });
      },
      searchmail: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").find({
                      email: data.email
                  }).toArray(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2[0]) {
                          callback({
                              value: true,
                              comment: "User found"
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
      },
      delete: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              var cuser = db.collection('user').remove({
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
      login: function(data, callback) {
          data.password = sails.md5(data.password);
          sails.query(function(err, db) {
              db.collection('user').find({
                  email: data.email,
                  password: data.password
              }, {
                  password: 0,
                  forgotpassword: 0,
                  wishlist: 0,
              }).toArray(function(err, found) {
                  if (err) {
                      callback({
                          value: false
                      });
                      console.log(err);
                      db.close();
                  }
                  if (found && found[0]) {
                      if (found[0].forgotpassword) {
                          db.collection("user").update({
                              email: data.email,
                              password: data.password
                          }, {
                              $set: {
                                  forgotpassword: ""
                              }
                          }, function(err, updated) {
                              if (err) {
                                  console.log(err);
                                  db.close();
                              } else if (updated) {
                                  db.close();
                              }
                          });
                      }
                      delete found[0].forgotpassword;
                      found[0].id = found[0]._id;
                      delete found[0]._id;
                      callback(found[0]);
                  } else {
                      db.collection('user').find({
                          email: data.email,
                          forgotpassword: data.password
                      }, {
                          password: 0,
                          forgotpassword: 0,
                          wishlist: 0
                      }).toArray(function(err, found) {
                          if (err) {
                              callback({
                                  value: false
                              });
                              console.log(err);
                              db.close();
                          }
                          if (found && found[0]) {
                              sails.ObjectID(data._id);
                              db.collection("user").update({
                                  email: data.email
                              }, {
                                  $set: {
                                      forgotpassword: "",
                                      password: data.password
                                  }
                              }, function(err, updated) {
                                  if (err) {
                                      console.log(err);
                                      db.close();
                                  } else if (updated) {
                                      db.close();
                                  }
                              });
                              found[0].id = found[0]._id;
                              delete found[0]._id;
                              callback(found[0]);
                          } else {
                              callback({
                                  value: false
                              });
                              db.close();
                          }
                      });
                  }
              });
          });
      },
      changepassword: function(data, callback) {
          if (data.password && data.password != "" && data.editpassword && data.editpassword != "" && data.email && data.email != "") {
              data.password = sails.md5(data.password);
              var user = sails.ObjectID(data._id);
              var newpass = sails.md5(data.editpassword);
              sails.query(function(err, db) {
                  if (err) {
                      console.log(err);
                      callback({
                          value: false,
                          comment: "Error"
                      });
                  } else if (db) {
                      db.collection("user").update({
                          "_id": user,
                          "email": data.email,
                          "password": data.password
                      }, {
                          $set: {
                              "password": newpass
                          }
                      }, function(err, updated) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (updated.result.nModified == 1 && updated.result.n == 1) {
                              callback({
                                  value: true
                              });
                              db.close();
                          } else if (updated.result.nModified != 1 && updated.result.n == 1) {
                              callback({
                                  value: false,
                                  comment: "Same password"
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
          } else {
              callback({
                  value: false,
                  comment: "Please provide all parameters"
              });
          }
      },
      forgotpassword: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection('user').find({
                      email: data.email
                  }).toArray(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2[0]) {
                          var text = "";
                          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                          for (var i = 0; i < 8; i++) {
                              text += possible.charAt(Math.floor(Math.random() * possible.length));
                          }
                          var encrypttext = sails.md5(text);
                          var user = sails.ObjectID(data2[0]._id);
                          db.collection("user").update({
                              email: data.email
                          }, {
                              $set: {
                                  forgotpassword: encrypttext
                              }
                          }, function(err, updated) {
                              if (err) {
                                  console.log(err);
                                  callback({
                                      value: false
                                  });
                                  db.close();
                              } else if (updated) {
                                  sails.request.get({
                                          url: "https://api.falconide.com/falconapi/web.send.rest?api_key=47e02d2b10604fc81304a5837577e286&subject=One Time Password For Aura-Art &fromname=" + sails.fromName + "&from=" + sails.fromEmail + "&replytoid=" + data.email + "&content=Password&recipients=" + data.email + "&footer=0&template=2175&clicktrack=0&ATT_PASS=" + text
                                      },
                                      function(err, httpResponse, body) {
                                          if (err) {
                                              callback({
                                                  value: false
                                              });
                                              db.close();
                                          } else {
                                              callback({
                                                  value: true,
                                                  comment: "Mail sent"
                                              });
                                              db.close();
                                          }
                                      });
                              } else {
                                  callback({
                                      value: false
                                  });
                                  db.close();
                              }
                          });
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
      countusers: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").count({}, function(err, number) {
                      if (number != null) {
                          callback(number);
                          db.close();
                      } else if (err) {
                          callback({
                              value: false
                          });
                          db.close();
                      } else {
                          callback({
                              value: false,
                              comment: "No user found"
                          });
                          db.close();
                      }
                  });
              }
          });
      },
      countartwork: function(data, callback) {
          var user = sails.ObjectID(data.user);
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").aggregate([{
                      $match: {
                          "artwork.name": {
                              $exists: true
                          }
                      }
                  }, {
                      $unwind: "$artwork"
                  }, {
                      $match: {
                          "artwork.name": {
                              $exists: true
                          }
                      }
                  }, {
                      $group: {
                          _id: user,
                          count: {
                              $sum: 1
                          }
                      }
                  }, {
                      $project: {
                          count: 1
                      }
                  }]).toArray(function(err, result) {
                      if (result[0]) {
                          callback(result[0].count);
                          db.close();
                      } else if (!result[0]) {
                          callback(0);
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
              }
          });
      },
      findbyaccess: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").find({
                      status: "approve",
                      accesslevel: data.accesslevel
                  }, {
                      password: 0,
                      forgotpassword: 0
                  }).sort({
                      name: 1
                  }).toArray(function(err, found) {
                      if (err) {
                          callback({
                              value: false
                          });
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
      saveforexcel: function(data, callback) {
          var newdata = {};
          newdata.name = data.username;
          newdata._id = sails.ObjectID();
          newdata.accesslevel = "artist";
          newdata.status = "approve";
          sails.query(function(err, db) {
              var exit = 0;
              var exitup = 0;
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  exit++;
                  db.collection("user").find({
                      name: data.username
                  }).each(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2 != null) {
                          exitup++;
                          callback(data2._id);
                          db.close();
                      } else {
                          if (exit != exitup) {
                              db.collection('user').insert(newdata, function(err, created) {
                                  if (err) {
                                      console.log(err);
                                      callback({
                                          value: false
                                      });
                                      db.close();
                                  } else if (created) {
                                      callback(newdata._id);
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
              }
          });
      },
      saveCustomer: function(data, callback) {
          var newdata = {};
          newdata.name = data.reseller;
          newdata._id = sails.ObjectID();
          newdata.accesslevel = "customer";
          sails.query(function(err, db) {
              var exit = 0;
              var exitup = 0;
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  exit++;
                  db.collection("user").find({
                      name: data.reseller
                  }).each(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2 != null) {
                          exitup++;
                          delete data2.accesslevel;
                          callback(data2);
                          db.close();
                      } else {
                          if (exit != exitup) {
                              db.collection('user').insert(newdata, function(err, created) {
                                  if (err) {
                                      console.log(err);
                                      callback({
                                          value: false
                                      });
                                      db.close();
                                  } else if (created) {
                                      delete newdata.accesslevel;
                                      callback(newdata);
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
              }
          });
      },
      findforexcel: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              } else if (db) {
                  db.collection("user").find({
                      name: data.username,
                      accesslevel: "artist"
                  }).toArray(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false
                          });
                          db.close();
                      } else if (data2 && data2[0]) {
                          callback(data2[0]);
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
      deletedata: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              db.collection('user').remove({
                  accesslevel: "artist"
              }, function(err, data) {
                  if (err) {
                      console.log(err);
                      callback({
                          value: false
                      });
                      db.close();
                  } else if (data) {
                      callback({
                          value: true,
                          comment: "Deleted"
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
      findUser: function(data, callback) {
          var spacedata = data.search;
          spacedata = "\\s" + spacedata;
          var check = new RegExp(spacedata, "i");
          data.search = "^" + data.search;
          var checkname = new RegExp(data.search, "i");
          var matchobj = {
              $or: [{
                  name: {
                      '$regex': checkname
                  }
              }, {
                  name: {
                      '$regex': check
                  }
              }],
              status: "approve",
              "artwork.type": data.type,
              accesslevel: "artist"
          };
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  if (!data.type || data.type == "") {
                      delete matchobj["artwork.type"];
                  }
                  db.collection("user").find(matchobj, {
                      _id: 1,
                      name: 1,
                      email: 1
                  }).sort({
                      name: 1
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
      findforart: function(data, callback) {
          var spacedata = data.search;
          spacedata = "\\s" + spacedata;
          var check = new RegExp(spacedata, "i");
          data.search = "^" + data.search;
          var checkname = new RegExp(data.search, "i");
          var matchobj = {
              $or: [{
                  name: {
                      '$regex': checkname
                  }
              }, {
                  name: {
                      '$regex': check
                  }
              }],
              status: "approve",
              accesslevel: "artist"
          };
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").find(matchobj, {
                      _id: 1,
                      name: 1,
                      email: 1
                  }).sort({
                      name: 1
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
      findCust: function(data, callback) {
          var spacedata = data.search;
          spacedata = "\\s" + spacedata;
          var check = new RegExp(spacedata, "i");
          data.search = "^" + data.search;
          var checkname = new RegExp(data.search, "i");
          var matchobj = {
              $or: [{
                  name: {
                      '$regex': checkname
                  }
              }, {
                  name: {
                      '$regex': check
                  }
              }],
              accesslevel: "reseller"
          };
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").find(matchobj, {
                      _id: 1,
                      name: 1,
                      email: 1
                  }).sort({
                      name: 1
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
      userbytype: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false,
                      comment: "Error"
                  });
              } else if (db) {
                  db.collection('user').aggregate([{
                      $match: {
                          status: "approve"
                      }
                  }, {
                      $unwind: "$artwork"
                  }, {
                      $match: {
                          "artwork.type": data.type
                      }
                  }, {
                      $group: {
                          _id: "$_id",
                          name: {
                              $addToSet: "$name"
                          },
                      }
                  }, {
                      $project: {
                          _id: 1,
                          name: 1
                      }
                  }, {
                      $unwind: "$name"
                  }, {
                      $sort: {
                          name: 1
                      }
                  }]).toArray(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false,
                              comment: "Error"
                          });
                          db.close();
                      } else if (data2 && data2[0]) {
                          callback(data2);
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
      saveArtist: function(data, callback) {
          delete data.cart;
          delete data.wishlist;
          delete data.wishlistfolder;
          if (data.medium && data.medium.length > 0) {
              _.each(data.medium, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.theme && data.theme.length > 0) {
              _.each(data.theme, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.reseller && data.reseller.length > 0) {
              _.each(data.reseller, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.artwork && data.artwork.length > 0) {
              _.each(data.artwork, function(e) {
                  e._id = sails.ObjectID(e._id);
                  if (e.subtype && e.subtype.length > 0) {
                      _.each(e.subtype, function(s) {
                          s._id = sails.ObjectID(s._id);
                      });
                  }
                  if (e.tag && e.tag.length > 0) {
                      _.each(e.tag, function(t) {
                          if (t._id)
                              t._id = sails.ObjectID(t._id);
                      });
                  }
                  if (e.reseller && e.reseller.length > 0) {
                      _.each(e.reseller, function(r) {
                          r._id = sails.ObjectID(r._id);
                      });
                  }
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
                  var selleremail = data.selleremail;
                  delete data.selleremail;
                  if (!data._id) {
                      data._id = sails.ObjectID();
                      db.collection('user').insert(data, function(err, created) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (created) {
                              data._id = data._id.toString();
                              var residence = "";
                              var studio = "";
                              if (data.residence) {
                                  residence = data.residence.flatno + ", " + data.residence.bldgname + ", " + data.residence.landmark + ", " + data.residence.street + ", " + data.residence.locality + ", " + data.residence.city + ", " + data.residence.pincode + ", " + data.residence.state + ", " + data.residence.country;
                              } else {
                                  residence = "N/A";
                              }
                              if (data.work) {
                                  studio = data.work.flatno + ", " + data.work.bldgname + ", " + data.work.landmark + ", " + data.work.street + ", " + data.work.locality + ", " + data.work.city + ", " + data.work.pincode + ", " + data.work.state + ", " + data.work.country;
                              } else {
                                  studio = "N/A";
                              }
                              var obj = {
                                  "api_key": "47e02d2b10604fc81304a5837577e286",
                                  "email_details": {
                                      "fromname": sails.fromName,
                                      "subject": "Artist %23" + data._id.substring(data._id.length - 5),
                                      "from": sails.fromEmail,
                                      "replytoid": "connect@aurart.in"
                                  },
                                  "settings": {
                                      "template": "2210",
                                  },
                                  "recipients": ["connect@aurart.in", data.email, selleremail],
                                  "attributes": {
                                      "NAME": [data.name],
                                      "SELLEREMAIL": [selleremail],
                                      "GENDER": [data.gender],
                                      "EMAIL": [data.email],
                                      "CCM": [data.personal.countrycode],
                                      "MOB": [data.personal.mob],
                                      "CCW": [data.work.countrycode],
                                      "CICW": [data.work.citycode],
                                      "WNO": [data.work.work],
                                      "CCR": [data.residence.countrycode],
                                      "CICR": [data.residence.citycode],
                                      "RNO": [data.residence.home],
                                      "RADD": [residence],
                                      "SADD": [studio],
                                      "DOB": [data.dob],
                                      "SOB": [data.stateofb],
                                      "WOA": [data.woa],
                                      "GALLERY": [data.galleries],
                                      "CLINK": [data.clink],
                                      "EBOOK": [data.eblink],
                                      "STATUS": [data.status],
                                      "COMMENT": [data.comment]
                                  }
                              };
                              sails.request.get({
                                  url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                              }, function(err, httpResponse, body) {
                                  if (err) {
                                      callback({
                                          value: false
                                      });
                                      db.close();
                                  } else if (body && body == "success") {
                                      callback({
                                          value: true,
                                          comment: "Mail sent"
                                      });
                                      db.close();
                                  } else {
                                      callback({
                                          value: false,
                                          comment: "Error"
                                      });
                                      db.close();
                                  }
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
                      var user = sails.ObjectID(data._id);
                      delete data._id;
                      var mydata = {};
                      mydata.comment = data.comment;
                      db.collection("user").update({
                          _id: user
                      }, {
                          $set: mydata
                      }, function(err, updated) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (updated) {
                              user = user.toString();
                              var residence = "";
                              var studio = "";
                              if (data.residence) {
                                  residence = data.residence.flatno + ", " + data.residence.bldgname + ", " + data.residence.landmark + ", " + data.residence.street + ", " + data.residence.locality + ", " + data.residence.city + ", " + data.residence.pincode + ", " + data.residence.state + ", " + data.residence.country;
                              } else {
                                  residence = "N/A";
                              }
                              if (data.work) {
                                  studio = data.work.flatno + ", " + data.work.bldgname + ", " + data.work.landmark + ", " + data.work.street + ", " + data.work.locality + ", " + data.work.city + ", " + data.work.pincode + ", " + data.work.state + ", " + data.work.country;
                              } else {
                                  studio = "N/A";
                              }
                              var obj = {
                                  "api_key": "47e02d2b10604fc81304a5837577e286",
                                  "email_details": {
                                      "fromname": sails.fromName,
                                      "subject": "Artist %23" + user.substring(user.length - 5),
                                      "from": sails.fromEmail,
                                      "replytoid": "connect@aurart.in"
                                  },
                                  "settings": {
                                      "template": "2210",
                                  },
                                  "recipients": ["connect@aurart.in", selleremail],
                                  "attributes": {
                                      "NAME": [data.name],
                                      "SELLEREMAIL": [selleremail],
                                      "GENDER": [data.gender],
                                      "EMAIL": [data.email],
                                      "CCM": [data.personal.countrycode],
                                      "MOB": [data.personal.mob],
                                      "CCW": [data.work.countrycode],
                                      "CICW": [data.work.citycode],
                                      "WNO": [data.work.work],
                                      "CCR": [data.residence.countrycode],
                                      "CICR": [data.residence.citycode],
                                      "RNO": [data.residence.home],
                                      "RADD": [residence],
                                      "SADD": [studio],
                                      "DOB": [data.dob],
                                      "SOB": [data.stateofb],
                                      "WOA": [data.woa],
                                      "GALLERY": [data.galleries],
                                      "CLINK": [data.clink],
                                      "EBOOK": [data.eblink],
                                      "STATUS": [data.status],
                                      "COMMENT": [data.comment]
                                  }
                              };
                              sails.request.get({
                                  url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                              }, function(err, httpResponse, body) {
                                  if (err) {
                                      callback({
                                          value: false
                                      });
                                      db.close();
                                  } else if (body && body == "success") {
                                      callback({
                                          value: true,
                                          comment: "Mail sent"
                                      });
                                      db.close();
                                  } else {
                                      callback({
                                          value: false,
                                          comment: "Error"
                                      });
                                      db.close();
                                  }
                              });
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
      saveBack: function(data, callback) {
          delete data.cart;
          delete data.wishlist;
          delete data.wishlistfolder;
          var selleremail = "";
          if (data.selleremail) {
              selleremail = data.selleremail;
          } else {
              selleremail = "";
          }
          delete data.selleremail;
          if (data.medium && data.medium.length > 0) {
              _.each(data.medium, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.theme && data.theme.length > 0) {
              _.each(data.theme, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.reseller && data.reseller.length > 0) {
              _.each(data.reseller, function(e) {
                  if (e._id && e._id != "") {
                      e._id = sails.ObjectID(e._id);
                  }
              });
          }
          if (data.artwork && data.artwork.length > 0) {
              _.each(data.artwork, function(e) {
                  e._id = sails.ObjectID(e._id);
                  if (e.subtype && e.subtype.length > 0) {
                      _.each(e.subtype, function(s) {
                          s._id = sails.ObjectID(s._id);
                      });
                  }
                  if (e.tag && e.tag.length > 0) {
                      _.each(e.tag, function(t) {
                          if (t._id)
                              t._id = sails.ObjectID(t._id);
                      });
                  }
                  if (e.reseller && e.reseller.length > 0) {
                      _.each(e.reseller, function(r) {
                          r._id = sails.ObjectID(r._id);
                      });
                  }
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
                  var user = sails.ObjectID(data._id);
                  delete data._id;
                  delete data.artwork;
                  db.collection("user").update({
                      _id: user
                  }, {
                      $set: data
                  }, function(err, updated) {
                      if (err) {
                          console.log(err);
                          callback({
                              value: false,
                              comment: "Error"
                          });
                          db.close();
                      } else if (updated) {
                          user = user.toString();
                          var residence = "";
                          var studio = "";
                          if (data.residence) {
                              residence = data.residence.flatno + ", " + data.residence.bldgname + ", " + data.residence.landmark + ", " + data.residence.street + ", " + data.residence.locality + ", " + data.residence.city + ", " + data.residence.pincode + ", " + data.residence.state + ", " + data.residence.country;
                          } else {
                              residence = "N/A";
                          }
                          if (data.work) {
                              studio = data.work.flatno + ", " + data.work.bldgname + ", " + data.work.landmark + ", " + data.work.street + ", " + data.work.locality + ", " + data.work.city + ", " + data.work.pincode + ", " + data.work.state + ", " + data.work.country;
                          } else {
                              studio = "N/A";
                          }
                          var obj = {
                              "api_key": "47e02d2b10604fc81304a5837577e286",
                              "email_details": {
                                  "fromname": sails.fromName,
                                  "subject": "Artist %23" + user.substring(user.length - 5),
                                  "from": sails.fromEmail,
                                  "replytoid": "connect@aurart.in"
                              },
                              "settings": {
                                  "template": "2210",
                              },
                              "recipients": ["connect@aurart.in", selleremail],
                              "attributes": {
                                  "NAME": [data.name],
                                  "SELLEREMAIL": [selleremail],
                                  "GENDER": [data.gender],
                                  "EMAIL": [data.email],
                                  "CCM": [data.personal.countrycode],
                                  "MOB": [data.personal.mob],
                                  "CCW": [data.work.countrycode],
                                  "CICW": [data.work.citycode],
                                  "WNO": [data.work.work],
                                  "CCR": [data.residence.countrycode],
                                  "CICR": [data.residence.citycode],
                                  "RNO": [data.residence.home],
                                  "RADD": [residence],
                                  "SADD": [studio],
                                  "DOB": [data.dob],
                                  "SOB": [data.stateofb],
                                  "WOA": [data.woa],
                                  "GALLERY": [data.galleries],
                                  "CLINK": [data.clink],
                                  "EBOOK": [data.eblink],
                                  "STATUS": [data.status],
                                  "COMMENT": [data.comment]
                              }
                          };
                          sails.request.get({
                              url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                          }, function(err, httpResponse, body) {
                              if (err) {
                                  callback({
                                      value: false
                                  });
                                  db.close();
                              } else if (body && body == "success") {
                                  callback({
                                      value: true,
                                      comment: "Mail sent"
                                  });
                                  db.close();
                              } else {
                                  callback({
                                      value: false,
                                      comment: "Error"
                                  });
                                  db.close();
                              }
                          });
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
      updateId: function(data, callback) {
          if (data.medium && data.medium.length > 0) {
              _.each(data.medium, function(g) {
                  g._id = sails.ObjectID(g._id);
              });
          }
          if (data.theme && data.theme.length > 0) {
              _.each(data.theme, function(b) {
                  b._id = sails.ObjectID(b._id);
              });
          }
          if (data.reseller && data.reseller.length > 0) {
              _.each(data.reseller, function(a) {
                  a._id = sails.ObjectID(a._id);
              });
          }
          if (data.artwork && data.artwork.length > 0) {
              _.each(data.artwork, function(e) {
                  e._id = sails.ObjectID(e._id);
                  if (e.subtype && e.subtype.length > 0) {
                      _.each(e.subtype, function(s) {
                          s._id = sails.ObjectID(s._id);
                      });
                  }
                  if (e.tag && e.tag.length > 0) {
                      _.each(e.tag, function(t) {
                          if (t._id)
                              t._id = sails.ObjectID(t._id);
                      });
                  }
                  if (e.reseller && e.reseller.length > 0) {
                      _.each(e.reseller, function(r) {
                          r._id = sails.ObjectID(r._id);
                      });
                  }
              });
          }
          if (data.cart && data.cart.length > 0) {
              _.each(data.cart, function(q) {
                  q.artwork = sails.ObjectID(q.artwork);
                  q._id = sails.ObjectID(q._id);
              });
          }
          if (data.wishlist && data.wishlist.length > 0) {
              _.each(data.wishlist, function(n) {
                  n.artwork = sails.ObjectID(n.artwork);
                  n._id = sails.ObjectID(n._id);
              });
          }
          if (data.wishlistfolder && data.wishlistfolder.length > 0) {
              _.each(data.wishlistfolder, function(f) {
                  f._id = sails.ObjectID(f._id);
              });
          }
          if (1 == 1) {
              sails.query(function(err, db) {
                  if (err) {
                      console.log(err);
                      callback({
                          value: false,
                          comment: "Error"
                      });
                  } else {
                      var user = sails.ObjectID(data._id);
                      delete data._id;
                      db.collection("user").update({
                          _id: user
                      }, {
                          $set: data
                      }, function(err, updated) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (updated) {
                              callback({
                                  value: true,
                                  comment: "Updated"
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
      },
      saveArtOrder: function(data, callback) {
          if (data.artwork && data.artwork.length > 0) {
              _.each(data.artwork, function(e) {
                  e._id = sails.ObjectID(e._id);
                  if (e.subtype && e.subtype.length > 0) {
                      _.each(e.subtype, function(s) {
                          s._id = sails.ObjectID(s._id);
                      });
                  }
                  if (e.tag && e.tag.length > 0) {
                      _.each(e.tag, function(t) {
                          if (t._id)
                              t._id = sails.ObjectID(t._id);
                      });
                  }
                  if (e.reseller && e.reseller.length > 0) {
                      _.each(e.reseller, function(r) {
                          r._id = sails.ObjectID(r._id);
                      });
                  }
              });
          }
          if (1 == 1) {
              sails.query(function(err, db) {
                  if (err) {
                      console.log(err);
                      callback({
                          value: false,
                          comment: "Error"
                      });
                  } else {
                      var user = sails.ObjectID(data._id);
                      delete data._id;
                      db.collection("user").update({
                          _id: user
                      }, {
                          $set: {
                              artwork: data.artwork
                          }
                      }, function(err, updated) {
                          if (err) {
                              console.log(err);
                              callback({
                                  value: false,
                                  comment: "Error"
                              });
                              db.close();
                          } else if (updated) {
                              callback({
                                  value: true,
                                  comment: "Updated"
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
      },
      findArtist: function(data, callback) {
          sails.query(function(err, db) {
              if (err) {
                  console.log(err);
                  callback({
                      value: false
                  });
              }
              if (db) {
                  db.collection("user").find({
                      accesslevel: "artist"
                  }).sort({
                      name: 1
                  }).toArray(function(err, found) {
                      if (err) {
                          callback({
                              value: false
                          });
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
      }
  };
