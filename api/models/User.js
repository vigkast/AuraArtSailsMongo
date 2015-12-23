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
        var updatedata = {
            _id: data._id
        };
        if (data.provider == "Twitter") {
            updatedata.tweetid = data.id;
            updatedata.token = data.token;
            updatedata.tokenSecret = data.tokenSecret;

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
            dbcall(insertdata, updatedata);
        } else if (data.provider == "Facebook") {
            updatedata.fbid = data.id;
            updatedata.accessToken = data.accessToken;
            updatedata.refreshToken = data.refreshToken;

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
            dbcall(insertdata, updatedata);
        } else {
            updatedata.googleid = data.id;
            updatedata.token = data.token;

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
            dbcall(insertdata, updatedata);
        }

        function dbcall(data, updatedata) {
            sails.query(function(err, db) {
                if (err) {
                    callback({
                        value: false
                    });
                }
                if (!updatedata._id) {
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
                                    data.id = created.ops[0]._id;
                                    delete data.accessToken;
                                    delete data.token;
                                    delete data.tokenSecret;
                                    callback(null, data);
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
                    });
                } else {
                    var user = updatedata._id;
                    delete updatedata._id;

                    db.collection('user').update({
                        "_id": sails.ObjectID(user)
                    }, {
                        $set: updatedata
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updatedata) {
                            updatedata.id = user;
                            delete updatedata.accessToken;
                            delete updatedata.token;
                            delete updatedata.tokenSecret;
                            callback(null, updated);
                        }
                    });
                }
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
                            delete data.password;
                            callback(data);
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
                    db.collection('user').update({
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
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            data.id = user;
                            callback({
                                value: true,
                                data: data
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
                if (data.type != "" && accesslevel == "artist") {
                    var matchobj = {
                        $or: [{
                            name: {
                                '$regex': check
                            }
                        }, {
                            email: {
                                '$regex': check
                            }
                        }],
                        accesslevel: accesslevel,
                        "artwork.type": data.type
                    };
                    callbackfunc1();
                } else {
                    var matchobj = {
                        $or: [{
                            name: {
                                '$regex': check
                            }
                        }, {
                            email: {
                                '$regex': check
                            }
                        }],
                        accesslevel: accesslevel
                    };
                    callbackfunc1();
                }

                function callbackfunc1() {
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
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        if (data.type && data.type != "") {
            var firstmatch = {
                $and: [{
                    name: check
                }, $or: [{
                    name: {
                        '$regex': checkname
                    }
                }, {
                    name: {
                        '$regex': checkspace
                    }
                }]],
                accesslevel: "artist",
                "artwork.type": data.type,
                focused: "focused"
            };
            var matchobj = {
                $and: [{
                    name: check
                }, $or: [{
                    name: {
                        '$regex': checkname
                    }
                }, {
                    name: {
                        '$regex': checkspace
                    }
                }]],
                accesslevel: "artist",
                "artwork.type": data.type
            };
            callbackfunc1();
        } else {
            var firstmatch = {
                $and: [{
                    name: check
                }, {
                    name: checkname
                }],
                accesslevel: "artist",
                focused: "focused"
            };
            var matchobj = {
                $and: [{
                    name: check
                }, {
                    name: checkname
                }],
                accesslevel: "artist"
            };
            callbackfunc1();
        }

        function callbackfunc1() {
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").count(matchobj, function(err, number) {
                        if (number) {
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
                        db.collection("user").find(firstmatch, {
                            password: 0,
                            forgotpassword: 0
                        }).sort({
                            name: 1
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (err) {
                                callback({
                                    value: false
                                });
                                console.log(err);
                            } else if (found && found[0]) {
                                newreturns.data = found;
                                secondcall();
                            } else {
                                secondcall();
                            }
                        });

                        function secondcall() {
                            db.collection("user").find(matchobj, {
                                password: 0,
                                forgotpassword: 0
                            }).sort({
                                name: 1
                            }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                                if (err) {
                                    callback({
                                        value: false
                                    });
                                    console.log(err);
                                    db.close();
                                } else if (found && found[0]) {
                                    _.each(found, function(n) {
                                        newreturns.data.push(n);
                                    });
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
                    if (found[0].forgotpassword) {
                        db.collection('user').update({
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
                            db.collection('user').update({
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
                    db.collection('user').update({
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
                        db.collection('user').update({
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
                                var template_name = "aura-art";
                                var template_content = [{
                                    "name": "aura-art",
                                    "content": "aura-art"
                                }]
                                var message = {
                                    "from_email": sails.fromEmail,
                                    "from_name": sails.fromName,
                                    "to": [{
                                        "email": data.email,
                                        "type": "to"
                                    }],
                                    "global_merge_vars": [{
                                        "name": "password",
                                        "content": text
                                    }]
                                };
                                sails.mandrill_client.messages.sendTemplate({
                                    "template_name": template_name,
                                    "template_content": template_content,
                                    "message": message
                                }, function(result) {
                                    callback({
                                        value: true,
                                        comment: "Mail Sent"
                                    });
                                    db.close();
                                }, function(e) {
                                    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
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
                    db.collection('artmedium').remove({}, function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (data2) {
                            db.collection("fs.files").remove({}, function(err, data3) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (data3) {
                                    db.collection("fs.chunks").remove({}, function(err, data4) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: false
                                            });
                                            db.close();
                                        } else if (data4) {
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
                                } else {
                                    callback({
                                        value: false,
                                        comment: "No data found"
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
        if (data.type && data.type != "") {
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
                "artwork.type": data.type,
                accesslevel: "artist"
            };
        } else {
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
                accesslevel: "artist"
            };
        }
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
                    name: 1
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
            accesslevel: "customer"
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
                    name: 1
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
    }
};
