/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    adminlogin: function (data, callback) {
        if (data.password) {
            data.password = sails.md5(data.password);
            sails.query(function (err, db) {
                if (db) {
                    db.collection('user').find({
                        email: data.email,
                        password: data.password,
                        accesslevel: "admin"
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: "false"
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            callback(found[0]);
                            db.close();
                        } else {
                            callback({
                                value: "false"
                            });
                            db.close();
                        }
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
                    });
                }
            });
        } else {
            callback({
                value: false
            });
        }
    },
    save: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (data.password) {
                    data.password = sails.md5(data.password);
                }
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("user").find({
                        "email": data.email
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            db.collection('user').insert(data, function (err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (created) {
                                    callback({
                                        value: true,
                                        id: data._id
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                }
                            });
                        }
                    });
                } else {
                    if (data._id && sails.ObjectID.isValid(data._id)) {
                        var user = sails.ObjectID(data._id);
                        delete data._id
                        db.collection('user').update({
                            _id: user
                        }, {
                            $set: data
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                callback({
                                    value: true
                                });
                                db.close();
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
                            comment: "Userid Incorrect"
                        });
                        db.close();
                    }
                }
            }
        });
    },
    findlimited: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var accesslevel = data.accesslevel;
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        var sortnum = parseInt(data.sort);
        var sort = {};
        sort[data.filter] = sortnum;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (data.type != "" && accesslevel == "artist") {
                    db.collection("user").count({
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
                    }, function (err, number) {
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
                        db.collection("user").find({
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
                        }, {
                            password: 0,
                            forgotpassword: 0
                        }, {
                            sort: sort
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
                                    comment: "No data found."
                                });
                                db.close();
                            }
                        });
                    }
                } else {
                    db.collection("user").count({
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
                    }, function (err, number) {
                        if (number) {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callbackfunc1();
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

                    function callbackfunc1() {
                        db.collection("user").find({
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
                        }, {
                            password: 0,
                            forgotpassword: 0
                        }, {
                            sort: sort
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
                                    comment: "No data found."
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    find: function (data, callback) {
        var returns = [];
        sails.query(function (err, db) {
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
                }).toArray(function (err, found) {
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
                            value: false
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findbyletter: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        data.search = "^" + data.search;
        var check = new RegExp(data.search, "i");
        var checkname = new RegExp(data.searchname, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (data.type != "") {
                    db.collection("user").count({
                        $and: [{
                            name: check
                        }, {
                            name: checkname
                        }],
                        accesslevel: "artist",
                        "artwork.type": data.type
                    }, function (err, number) {
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
                        db.collection("user").find({
                            $and: [{
                                name: check
                        }, {
                                name: checkname
                        }],
                            accesslevel: "artist",
                            "artwork.type": data.type
                        }, {
                            password: 0,
                            forgotpassword: 0
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
                                    comment: "No data found."
                                });
                                db.close();
                            }
                        });
                    }
                } else {
                    db.collection("user").count({
                        $and: [{
                            name: check
                        }, {
                            name: checkname
                        }],
                        accesslevel: "artist"
                    }, function (err, number) {
                        if (number) {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callbackfunc1();
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

                    function callbackfunc1() {
                        db.collection("user").find({
                            $and: [{
                                name: check
                        }, {
                                name: checkname
                        }],
                            accesslevel: "artist"
                        }, {
                            password: 0,
                            forgotpassword: 0
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
                                    comment: "No data found."
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    findone: function (data, callback) {
        if (data._id && sails.ObjectID.isValid(data._id)) {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").find({
                        "_id": sails.ObjectID(data._id)
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function (err, data2) {
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
                                comment: "User not found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Userid incorrect."
            });
        }
    },
    searchmail: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "email": data.email
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback({
                            value: true
                        });
                        db.close();
                    } else {
                        callback({
                            value: false
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        if (data._id && sails.ObjectID.isValid(data._id)) {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                var cuser = db.collection('user').remove({
                    _id: sails.ObjectID(data._id)
                }, function (err, deleted) {
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
                            comment: "User not found"
                        });
                        db.close();
                    }
                });
            });
        } else {
            callback({
                value: false,
                comment: "Userid Incorrect"
            });
        }
    },
    login: function (data, callback) {
        data.password = sails.md5(data.password);
        sails.query(function (err, db) {
            db.collection('user').find({
                email: data.email,
                password: data.password
            }, {
                password: 0
            }).toArray(function (err, found) {
                if (err) {
                    callback({
                        value: false
                    });
                    console.log(err);
                    db.close();
                }
                if (found && found[0]) {
                    console.log(found[0]);
                    if (found[0].forgotpassword) {
                        db.collection('user').update({
                            email: data.email,
                            password: data.password
                        }, {
                            $set: {
                                forgotpassword: ""
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                db.close();
                            }
                        });
                    }
                    delete found[0].forgotpassword;
                    callback(found[0]);
                } else {
                    db.collection('user').find({
                        email: data.email,
                        forgotpassword: data.password
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        }
                        if (found && found[0]) {
                            callback(found[0]);
                            sails.ObjectID(data._id);
                            db.collection('user').update({
                                email: data.email
                            }, {
                                $set: {
                                    forgotpassword: "",
                                    password: data.password
                                }
                            }, function (err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                } else if (updated) {
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
                }
            });
        });
    },
    changepassword: function (data, callback) {
        if (data._id && sails.ObjectID.isValid(data._id)) {
            data.password = sails.md5(data.password);
            var user = sails.ObjectID(data._id);
            var newpass = sails.md5(data.editpassword);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    if (data.editpassword && data.editpassword == "") {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data.editpassword && data.editpassword != "") {
                        db.collection('user').update({
                            "_id": user,
                            "email": data.email,
                            "password": data.password
                        }, {
                            $set: {
                                "password": newpass
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                if (updated.result.nModified && updated.result.nModified == 1) {
                                    callback({
                                        value: true
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                }
                            } else {
                                callback({
                                    value: false,
                                    comment: "No Such User"
                                });
                                db.close();
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: "No Edit Password"
                        });
                        db.close();
                    }
                }
            });
        } else {
            callback({
                value: false,
                comment: "Userid Incorrect"
            });
        }
    },
    forgotpassword: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection('user').find({
                    email: data.email
                }).toArray(function (err, data2) {
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
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                var template_name = "Aura Art";
                                var template_content = [{
                                    "name": "aura-art",
                                    "content": "aura-art"
                                    }]
                                var message = {
                                    "from_email": "vigneshkasthuri2009@gmail.com",
                                    "from_name": "Wohlig",
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
                                }, function (result) {
                                    callback({
                                        value: true
                                    });
                                    db.close();
                                }, function (e) {
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
                            comment: "No Such User"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    countusers: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({}, function (err, number) {
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
                            comment: "No user found."
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findimage: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("fs.files").find({}, {}).toArray(function (err, found) {
                    if (err) {
                        console.log({
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
    countartwork: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
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
        }]).toArray(function (err, result) {
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
                            comment: "No Artwok found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findbyaccess: function (data, callback) {
        sails.query(function (err, db) {
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
                }).toArray(function (err, found) {
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
                            comment: "No User found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    removeimage: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("fs.files").remove({}, function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data) {
                        db.collection("fs.chunks").remove({}, function (err, data) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (data) {
                                callback({
                                    value: true
                                });
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: "No dta found"
                        });
                    }
                });
            }
        });
    },
    
    saveforexcel: function (data, callback) {
        var newdata = {};
        newdata.name = data.username;
        newdata._id = sails.ObjectID();
        newdata.accesslevel = "artist";
        sails.query(function (err, db) {
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
                    "name": data.username
                }).each(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data2 != null) {
                        exitup++;
                        callback(data2._id);
                        db.close();
                    } else {
                        if (exit != exitup) {
                            db.collection('user').insert(newdata, function (err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                }
                                if (created) {
                                    callback(newdata._id);
                                    db.close();
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    deletedata: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('user').remove({}, function (err, data) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else if (data) {
                    db.collection('artmedium').remove({}, function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (data2) {
                            db.collection("fs.files").remove({}, function (err, data3) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (data3) {
                                    db.collection("fs.chunks").remove({}, function (err, data4) {
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
                                                comment: "No data to delete"
                                            });
                                            db.close();
                                        }
                                    });
                                } else {
                                    callback({
                                        value: false,
                                        comment: "No data to delete"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            callback({
                                value: false,
                                comment: "No data to delete"
                            });
                            db.close();
                        }
                    });
                } else {
                    callback({
                        value: false,
                        comment: "No data to delete"
                    });
                    db.close();
                }
            });
        });
    },
    countimage: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("fs.files").count({}, function (err, number) {
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
                            comment: "No Image found."
                        });
                        db.close();
                    }
                });
            }
        });
    }
};