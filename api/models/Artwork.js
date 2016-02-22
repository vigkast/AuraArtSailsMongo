/**
 * Artwork.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function(data, callback) {
        data.srno = parseInt(data.srno);
        var user = sails.ObjectID(data.user);
        delete data.user;
        delete data.cart;
        delete data.wishlist;
        if (data.reseller && data.reseller.length > 0) {
            _.each(data.reseller, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.subtype && data.subtype.length > 0) {
            _.each(data.subtype, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.tag && data.tag.length > 0) {
            _.each(data.tag, function(y) {
                if (y._id && y._id != "") {
                    y._id = sails.ObjectID(y._id);
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
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            artwork: data
                        }
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated) {
                            callback({
                                value: true,
                                comment: "Mail sent"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                        }
                    });
                } else {
                    data._id = sails.ObjectID(data._id);
                    tobechanged = {};
                    var attribute = "artwork.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "artwork._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
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
            }
        });
    },
    saveFront: function(data, callback) {
        delete data.cart;
        delete data.wishlist;
        data.srno = parseInt(data.srno);
        var user = sails.ObjectID(data.user);
        delete data.user;
        data.reseller[0].email = data.selleremail;
        var email = data.email;
        var selleremail = data.selleremail;
        var sellername = data.sellername;
        var artistname = data.artistname;
        delete data.email;
        delete data.selleremail;
        delete data.sellername;
        delete data.artistname;
        if (data.reseller && data.reseller.length > 0) {
            _.each(data.reseller, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.subtype && data.subtype.length > 0) {
            _.each(data.subtype, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.tag && data.tag.length > 0) {
            _.each(data.tag, function(y) {
                if (y._id && y._id != "") {
                    y._id = sails.ObjectID(y._id);
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
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            artwork: data
                        }
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated) {
                            var obj = {
                                "api_key": "47e02d2b10604fc81304a5837577e286",
                                "email_details": {
                                    "fromname": sails.fromName,
                                    "subject": "Data of Artworks submitted on www.auraart.in",
                                    "from": sails.fromEmail,
                                    "replytoid": "connect@auraart.in"
                                },
                                "settings": {
                                    "template": "2211",
                                },
                                "recipients": ["connect@auraart.in", email, selleremail],
                                "attributes": {
                                    "ANAME": [artistname],
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
                        }
                    });
                } else {
                    tobechanged = {};
                    var attribute = "artwork.$.";
                    _.forIn({
                        chat: data.chat
                    }, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "artwork._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated) {
                            var obj = {
                                "api_key": "47e02d2b10604fc81304a5837577e286",
                                "email_details": {
                                    "fromname": sails.fromName,
                                    "subject": "Data of Artworks submitted on www.auraart.in",
                                    "from": sails.fromEmail,
                                    "replytoid": "connect@auraart.in"
                                },
                                "settings": {
                                    "template": "2211",
                                },
                                "recipients": ["connect@auraart.in", selleremail, email],
                                "attributes": {
                                    "ANAME": [artistname]
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
        data.srno = parseInt(data.srno);
        if (data.reseller && data.reseller.length > 0) {
            _.each(data.reseller, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.subtype && data.subtype.length > 0) {
            _.each(data.subtype, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.tag && data.tag.length > 0) {
            _.each(data.tag, function(y) {
                if (y._id && y._id != "") {
                    y._id = sails.ObjectID(y._id);
                }
            });
        }
        var user = sails.ObjectID(data.user);
        delete data.user;
        var email = data.email;
        var selleremail = "";
        if (data.selleremail) {
            selleremail = data.selleremail;
        }
        var sellername = data.sellername;
        var artistname = data.artistname;
        delete data.email;
        delete data.selleremail;
        delete data.sellername;
        delete data.artistname;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else {
                data._id = sails.ObjectID(data._id);
                tobechanged = {};
                var attribute = "artwork.$.";
                _.forIn(data, function(value, key) {
                    tobechanged[attribute + key] = value;
                });
                db.collection("user").update({
                    "_id": user,
                    "artwork._id": data._id
                }, {
                    $set: tobechanged
                }, function(err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (updated) {
                        console.log(artistname);
                        var obj = {
                            "api_key": "47e02d2b10604fc81304a5837577e286",
                            "email_details": {
                                "fromname": sails.fromName,
                                "subject": "Data of Artworks submitted on www.auraart.in",
                                "from": sails.fromEmail,
                                "replytoid": "connect@auraart.in"
                            },
                            "settings": {
                                "template": "2211",
                            },
                            "recipients": ["connect@auraaart.in", selleremail],
                            "attributes": {
                                "ANAME": [artistname]
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
    delete: function(data, callback) {
        delete data.cart;
        delete data.wishlist;
        if (data.reseller && data.reseller.length > 0) {
            _.each(data.reseller, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.subtype && data.subtype.length > 0) {
            _.each(data.subtype, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.tag && data.tag.length > 0) {
            _.each(data.tag, function(y) {
                if (y._id && y._id != "") {
                    y._id = sails.ObjectID(y._id);
                }
            });
        }
        var user = sails.ObjectID(data.user);
        delete data.user;
        data._id = sails.ObjectID(data._id);
        if (data.srno && data.srno != "") {
            data.srno = parseInt(data.srno);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
                db.collection("user").update({
                    _id: user
                }, {
                    $pull: {
                        "artwork": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function(err, updated) {
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
        var user = sails.ObjectID(data.user);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: user,
                    "artwork._id": sails.ObjectID(data._id)
                }, {
                    email: 1,
                    name: 1,
                    "artwork.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].artwork && data2[0].artwork[0]) {
                        data2[0].artwork[0].email = data2[0].email;
                        data2[0].artwork[0].artistname = data2[0].name;
                        callback(data2[0].artwork[0]);
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
    find: function(data, callback) {
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
                        _id: user
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
                    $project: {
                        artwork: 1
                    }
                }]).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].artwork && data2[0].artwork[0]) {
                        callback(data2);
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
    findall: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([{
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork.name": {
                            $exists: true
                        }
                    }
                }, {
                    $project: {
                        artwork: 1
                    }
                }]).toArray(function(err, data2) {
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
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                    }
                });
            }
        });
    },
    findlimited: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var newcallback = 0;
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                var sortnum = parseInt(data.sort);
                var sort = {};
                sort['artwork.' + data.filter] = sortnum;
                if (data.type && data.type != "") {
                    var matchobj = {
                        _id: user,
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork.type": data.type,
                        "artwork.name": {
                            $regex: check
                        },
                        "artwork.status": data.status
                    };
                    callbackfunc1();
                } else {
                    var matchobj = {
                        _id: user,
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork.name": {
                            $regex: check
                        },
                        "artwork.status": data.status
                    };
                    callbackfunc1();
                }

                function callbackfunc1() {
                    if (!data.status || data.status == "" || data.status == "All") {
                        delete matchobj["artwork.status"];
                    }
                    db.collection("user").aggregate([{
                        $match: matchobj
                    }, {
                        $unwind: "$artwork"
                    }, {
                        $match: matchobj
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                        db.collection("user").aggregate([{
                            $match: matchobj
                        }, {
                            $unwind: "$artwork"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                artwork: 1
                            }
                        }, {
                            $sort: sort
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                }
            }
        });
    },
    findbyid: function(data, callback) {
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
                        "artwork._id": sails.ObjectID(data._id)
                    }
                }, {
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork._id": sails.ObjectID(data._id)
                    }
                }, {
                    $project: {
                        name: 1,
                        artwork: 1,
                        focused: 1
                    }
                }]).toArray(function(err, found) {
                    if (found && found[0]) {
                        callback(found);
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
    deleteout: function(data, callback) {
        delete data.cart;
        delete data.wishlist;
        if (data.reseller && data.reseller.length > 0) {
            _.each(data.reseller, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.subtype && data.subtype.length > 0) {
            _.each(data.subtype, function(x) {
                if (x._id && x._id != "") {
                    x._id = sails.ObjectID(x._id);
                }
            });
        }
        if (data.tag && data.tag.length > 0) {
            _.each(data.tag, function(y) {
                if (y._id && y._id != "") {
                    y._id = sails.ObjectID(y._id);
                }
            });
        }
        var user = sails.ObjectID(data.user);
        delete data.user;
        if (data.srno && data.srno != "") {
            data.srno = parseInt(data.srno);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").update({
                    _id: user
                }, {
                    $pull: {
                        "artwork": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function(err, updated) {
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
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findlimitedout: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                var sortnum = parseInt(data.sort);
                var sort = {};
                sort['artwork.' + data.filter] = sortnum;
                var matchobj = {
                    "artwork.name": {
                        $exists: true
                    },
                    "artwork.name": {
                        $regex: check
                    },
                    "artwork.type": data.type,
                    "artwork.status": data.status
                };
                callbackfunc1();

                function callbackfunc1() {
                    if (!data.status || data.status == "" || data.status == "All") {
                        delete matchobj["artwork.status"];
                    }
                    if (!data.type || data.type == "") {
                        delete matchobj["artwork.type"];
                    }
                    db.collection("user").aggregate([{
                        $match: matchobj
                    }, {
                        $unwind: "$artwork"
                    }, {
                        $match: matchobj
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                        db.collection("user").aggregate([{
                            $match: matchobj
                        }, {
                            $unwind: "$artwork"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                artwork: 1
                            }
                        }, {
                            $sort: sort
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                            }
                        });
                    }
                }
            }
        });
    },
    lastsr: function(data, callback) {
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
                    $unwind: "$artwork"
                }, {
                    $project: {
                        _id: 0,
                        "artwork.srno": 1
                    }
                }, {
                    $sort: {
                        "artwork.srno": -1
                    }
                }]).limit(1).toArray(function(err, result) {
                    if (result && result[0]) {
                        callback(result[0].artwork);
                        db.close();
                    } else if (!result[0]) {
                        var artwork = {};
                        artwork.srno = 0
                        callback(artwork);
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
    saveartwork: function(data) {
        var user = sails.ObjectID(data.user);
        delete data.user;
        data._id = sails.ObjectID();
        data.srno = parseInt(data.srno);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.collection("user").update({
                    _id: user
                }, {
                    $push: {
                        artwork: data
                    }
                }, function(err, updated) {
                    if (err) {
                        console.log(err);
                        db.close();
                    } else if (updated) {
                        db.close();
                    } else {
                        console.log("No user found");
                        db.close();
                    }
                });
            }
        });
    },
    artworktype: function(data, callback) {
        var matcharray = [];
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var checkmedium = new RegExp(data.medium, "i");
                var checkcolor = new RegExp(data.color, "i");
                var checkstyle = new RegExp(data.style, "i");
                var checkelement = new RegExp(data.element, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                var sortnum = parseInt(data.sort);
                var sort = {};
                if (data.filter && data.filter == "srno") {
                    sort = {};
                    sort.focused = 1;
                    sort.name = 1;
                    sort['artwork.srno'] = 1;
                } else {
                    sort = {};
                    sort.focused = 1;
                    sort['artwork.' + data.filter] = sortnum;
                    sort.name = 1;
                }
                if (data.color) {
                    matcharray.push(data.color);
                }
                if (data.style) {
                    matcharray.push(data.style);
                }
                if (data.element) {
                    matcharray.push(data.element);
                }
                if (matcharray && !matcharray[0]) {
                    matcharray = [];
                }
                if (data.minprice == "") {
                    data.minprice = 0;
                }
                if (data.maxprice == "") {
                    data.maxprice = 0;
                }
                if (data.minheight == "") {
                    data.minheight = 0;
                }
                if (data.maxheight == "") {
                    data.maxheight = 0;
                }
                if (data.minwidth == "") {
                    data.minwidth = 0;
                }
                if (data.maxwidth == "") {
                    data.maxwidth = 0;
                }
                if (data.minbreadth == "") {
                    data.minbreadth = 0;
                }
                if (data.maxbreadth == "") {
                    data.maxbreadth = 0;
                }
                var matchobj = {
                    "artwork.type": data.type,
                    "artwork.subtype.name": {
                        $regex: checkmedium
                    },
                    "artwork.tag.name": {
                        $in: matcharray
                    },
                    status: "approve",
                    $or: [{
                        "artwork.status": "approve"
                    }, {
                        "artwork.status": "sold"
                    }],
                    name: {
                        $regex: check
                    },
                    "artwork.gprice": {
                        $gte: data.minprice,
                        $lte: data.maxprice
                    },
                    "artwork.height": {
                        $gte: data.minheight,
                        $lte: data.maxheight
                    },
                    "artwork.width": {
                        $gte: data.minwidth,
                        $lte: data.maxwidth
                    },
                    "artwork.breadth": {
                        $gte: data.minbreadth,
                        $lte: data.maxbreadth
                    }
                };
                if (data.type == "") {
                    delete matchobj["artwork.type"];
                }
                if (matchobj["artwork.tag.name"].$in.length == 0) {
                    delete matchobj["artwork.tag.name"];
                }
                if (data.search == "") {
                    delete matchobj.name;
                }
                if (data.medium == "") {
                    delete matchobj["artwork.subtype.name"];
                }
                if (data.minprice == 0 && data.maxprice == 0) {
                    delete matchobj["artwork.gprice"];
                }
                if (data.minheight == 0 && data.maxheight == 0) {
                    delete matchobj["artwork.height"];
                }
                if (data.minwidth == 0 && data.maxwidth == 0) {
                    delete matchobj["artwork.width"];
                }
                if (data.minbreadth == 0 && data.maxbreadth == 0) {
                    delete matchobj["artwork.breadth"];
                }
                callme();

                function callme() {
                    db.collection("user").aggregate([{
                        $match: matchobj
                    }, {
                        $unwind: "$artwork"
                    }, {
                        $match: matchobj
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                        db.collection("user").aggregate([{
                            $match: matchobj
                        }, {
                            $unwind: "$artwork"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                name: 1,
                                artwork: 1,
                                focused: 1
                            }
                        }]).sort(sort).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                            }
                        });
                    }
                }
            }
        });
    },
    searchartwork: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                var newreturns = {};
                newreturns.data = [];
                var spacedata = data.search;
                spacedata = "\\s" + spacedata;
                var check = new RegExp(spacedata, "i");
                data.search = "^" + data.search;
                var checkname = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                if (data.type && data.type == "Artist") {
                    db.collection("user").aggregate([{
                        $match: {
                            $or: [{
                                name: {
                                    $regex: checkname
                                }
                            }, {
                                name: {
                                    $regex: check
                                }
                            }],
                            status: "approve",
                            accesslevel: "artist"
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                            callartist();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callartist();
                        }
                    });

                    function callartist() {
                        db.collection("user").aggregate([{
                            $match: {
                                $or: [{
                                    name: {
                                        $regex: checkname
                                    }
                                }, {
                                    name: {
                                        $regex: check
                                    }
                                }],
                                status: "approve",
                                accesslevel: "artist"
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
                                _id: user,
                                artwork: {
                                    $addToSet: "$artwork"
                                }
                            }
                        }, {
                            $project: {
                                name: 1,
                                artwork: 1
                            }
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
                                db.close();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                } else if (data.type == "Paintings" || data.type == "Sculptures" || data.type == "Photographs" || data.type == "Prints") {
                    db.collection("user").aggregate([{
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            $and: [{
                                $or: [{
                                    "artwork.name": {
                                        $regex: checkname
                                    }
                                }, {
                                    "artwork.name": {
                                        $regex: check
                                    }
                                }]
                            }, {
                                $or: [{
                                    "artwork.status": "approve"
                                }, {
                                    "artwork.status": "sold"
                                }]
                            }],
                            "artwork.type": data.type
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                            callartwork();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callartwork();
                        }
                    });

                    function callartwork() {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $and: [{
                                    $or: [{
                                        "artwork.name": {
                                            $regex: checkname
                                        }
                                    }, {
                                        "artwork.name": {
                                            $regex: check
                                        }
                                    }]
                                }, {
                                    $or: [{
                                        "artwork.status": "approve"
                                    }, {
                                        "artwork.status": "sold"
                                    }]
                                }],
                                "artwork.type": data.type
                            }
                        }, {
                            $group: {
                                _id: "$_id",
                                name: {
                                    $addToSet: "$name"
                                },
                                artwork: {
                                    $addToSet: "$artwork"
                                }
                            }
                        }, {
                            $project: {
                                name: 1,
                                artwork: 1
                            }
                        }, {
                            $unwind: "$name"
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                } else if (data.type == "Art-medium") {
                    db.collection("user").aggregate([{
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            $or: [{
                                "artwork.subtype.name": {
                                    $regex: checkname
                                }
                            }, {
                                "artwork.subtype.name": {
                                    $regex: check
                                }
                            }]
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                            callmedium();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callmedium();
                        }
                    });

                    function callmedium() {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $or: [{
                                    "artwork.subtype.name": {
                                        $regex: checkname
                                    }
                                }, {
                                    "artwork.subtype.name": {
                                        $regex: check
                                    }
                                }]
                            }
                        }, {
                            $group: {
                                _id: "$_id",
                                name: {
                                    $addToSet: "$name"
                                },
                                artwork: {
                                    $addToSet: "$artwork"
                                }
                            }
                        }, {
                            $project: {
                                name: 1,
                                artwork: 1
                            }
                        }, {
                            $unwind: "$name"
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                } else if (data.type == "Tag") {
                    db.collection("user").aggregate([{
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            $or: [{
                                "artwork.tag.name": {
                                    $regex: checkname
                                }
                            }, {
                                "artwork.tag.name": {
                                    $regex: check
                                }
                            }]
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                            calltag();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            calltag();
                        }
                    });

                    function calltag() {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $or: [{
                                    "artwork.tag.name": {
                                        $regex: checkname
                                    }
                                }, {
                                    "artwork.tag.name": {
                                        $regex: check
                                    }
                                }]
                            }
                        }, {
                            $group: {
                                _id: "$_id",
                                name: {
                                    $addToSet: "$name"
                                },
                                artwork: {
                                    $addToSet: "$artwork"
                                }
                            }
                        }, {
                            $project: {
                                name: 1,
                                artwork: 1
                            }
                        }, {
                            $unwind: "$name"
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                } else {
                    db.collection("user").aggregate([{
                        $match: {
                            $or: [{
                                name: {
                                    $regex: checkname
                                }
                            }, {
                                name: {
                                    $regex: check
                                }
                            }],
                            status: "approve",
                            accesslevel: "artist"
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
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                            callbackfunc();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callbackfunc1();
                        }
                    });

                    function callbackfunc() {
                        db.collection("user").aggregate([{
                            $match: {
                                $or: [{
                                    name: {
                                        $regex: checkname
                                    }
                                }, {
                                    name: {
                                        $regex: check
                                    }
                                }],
                                status: "approve",
                                accesslevel: "artist"
                            }
                        }, {
                            $project: {
                                name: 1,
                                artwork: 1
                            }
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                _.each(found, function(x) {
                                    newreturns.data.push(x);
                                });
                                callbackfunc1();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else {
                                callbackfunc1();
                            }
                        });
                    }

                    function callbackfunc1() {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $and: [{
                                    $or: [{
                                        "artwork.name": {
                                            $regex: checkname
                                        }
                                    }, {
                                        "artwork.name": {
                                            $regex: check
                                        }
                                    }]
                                }, {
                                    $or: [{
                                        "artwork.status": "approve"
                                    }, {
                                        "artwork.status": "sold"
                                    }]
                                }],
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
                            if (result && result[0]) {
                                newreturns.total = result[0].count;
                                newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                                callbackfunc2();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else {
                                callbackfunc3();
                            }
                        });

                        function callbackfunc2() {
                            db.collection("user").aggregate([{
                                $unwind: "$artwork"
                            }, {
                                $match: {
                                    $and: [{
                                        $or: [{
                                            "artwork.name": {
                                                $regex: checkname
                                            }
                                        }, {
                                            "artwork.name": {
                                                $regex: check
                                            }
                                        }]
                                    }, {
                                        $or: [{
                                            "artwork.status": "approve"
                                        }, {
                                            "artwork.status": "sold"
                                        }]
                                    }],
                                }
                            }, {
                                $group: {
                                    _id: "$_id",
                                    name: {
                                        $addToSet: "$name"
                                    },
                                    artwork: {
                                        $addToSet: "$artwork"
                                    }
                                }
                            }, {
                                $project: {
                                    name: 1,
                                    artwork: 1
                                }
                            }, {
                                $unwind: "$name"
                            }, {
                                $sort: {
                                    name: 1
                                }
                            }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found1) {
                                if (found1 && found1[0]) {
                                    _.each(found1, function(y) {
                                        newreturns.data.push(y);
                                    });
                                    callbackfunc3();
                                } else if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else {
                                    callbackfunc3();
                                }
                            });
                        }
                    }

                    function callbackfunc3() {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $or: [{
                                    "artwork.subtype.name": {
                                        $regex: checkname
                                    }
                                }, {
                                    "artwork.subtype.name": {
                                        $regex: check
                                    }
                                }]
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
                            if (result && result[0]) {
                                newreturns.total = result[0].count;
                                newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                                callbackfunc4();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else {
                                callbackfunc4();
                            }
                        });

                        function callbackfunc4() {
                            db.collection("user").aggregate([{
                                $unwind: "$artwork"
                            }, {
                                $match: {
                                    $or: [{
                                        "artwork.subtype.name": {
                                            $regex: checkname
                                        }
                                    }, {
                                        "artwork.subtype.name": {
                                            $regex: check
                                        }
                                    }]
                                }
                            }, {
                                $group: {
                                    _id: "$_id",
                                    name: {
                                        $addToSet: "$name"
                                    },
                                    artwork: {
                                        $addToSet: "$artwork"
                                    }
                                }
                            }, {
                                $project: {
                                    name: 1,
                                    artwork: 1
                                }
                            }, {
                                $unwind: "$name"
                            }, {
                                $sort: {
                                    name: 1
                                }
                            }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found2) {
                                if (found2 && found2[0]) {
                                    _.each(found2, function(z) {
                                        newreturns.data.push(z);
                                    });
                                    callbackfunc5();
                                } else if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else {
                                    callbackfunc5();
                                }
                            });
                        }
                    }

                    function callbackfunc5() {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $or: [{
                                    "artwork.tag.name": {
                                        $regex: checkname
                                    }
                                }, {
                                    "artwork.tag.name": {
                                        $regex: check
                                    }
                                }]
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
                            if (result && result[0]) {
                                newreturns.total = result[0].count;
                                newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                                callbackfunc6();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else {
                                callbackfunc6();
                            }
                        });

                        function callbackfunc6() {
                            db.collection("user").aggregate([{
                                $unwind: "$artwork"
                            }, {
                                $match: {
                                    $or: [{
                                        "artwork.tag.name": {
                                            $regex: checkname
                                        }
                                    }, {
                                        "artwork.tag.name": {
                                            $regex: check
                                        }
                                    }]
                                }
                            }, {
                                $group: {
                                    _id: "$_id",
                                    name: {
                                        $addToSet: "$name"
                                    },
                                    artwork: {
                                        $addToSet: "$artwork"
                                    }
                                }
                            }, {
                                $project: {
                                    name: 1,
                                    artwork: 1
                                }
                            }, {
                                $unwind: "$name"
                            }, {
                                $sort: {
                                    name: 1
                                }
                            }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found3) {
                                if (found3 && found3[0]) {
                                    _.each(found3, function(a) {
                                        newreturns.data.push(a);
                                    });
                                    callback(newreturns);
                                    db.close();
                                } else if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else {
                                    _.each(found3, function(a) {
                                        newreturns.data.push(a);
                                    });
                                    callback(newreturns);
                                    db.close();
                                }
                            });
                        }
                    }
                }
            }
        });
    },
    searchdrop: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                var i = 0;
                var newreturns = [];
                var spacedata = data.search;
                spacedata = "\\s" + spacedata;
                var check = new RegExp(spacedata, "i");
                data.search = "^" + data.search;
                var checkname = new RegExp(data.search, "i");
                var user = sails.ObjectID(data.user);
                async.parallel([
                    function(callback) {
                        db.collection("user").find({
                            $or: [{
                                name: {
                                    $regex: checkname
                                }
                            }, {
                                name: {
                                    $regex: check
                                }
                            }],
                            status: "approve",
                            accesslevel: "artist"
                        }, {
                            _id: 0,
                            name: 1
                        }).sort({
                            name: 1
                        }).limit(10).toArray(function(err, data2) {
                            if (data2 && data2[0]) {
                                _.each(data2, function(user) {
                                    user.type = "Artist";
                                    newreturns.push(user);
                                });
                                callback(null, newreturns);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        db.collection("user").aggregate([{
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                $and: [{
                                    $or: [{
                                        "artwork.name": {
                                            "$regex": checkname
                                        }
                                    }, {
                                        "artwork.name": {
                                            "$regex": check
                                        }
                                    }]
                                }, {
                                    $or: [{
                                        "artwork.status": "approve"
                                    }, {
                                        "artwork.status": "sold"
                                    }]
                                }]
                            }
                        }, {
                            $group: {
                                _id: "$_id",
                                name: {
                                    $addToSet: "$artwork.name"
                                },
                                type: {
                                    $addToSet: "$artwork.type"
                                }
                            }
                        }, {
                            $project: {
                                _id: 0,
                                name: 1,
                                type: 1
                            }
                        }, {
                            $unwind: "$name"
                        }, {
                            $unwind: "$type"
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).limit(10).toArray(function(err, data3) {
                            console.log(data3);
                            if (data3 && data3[0]) {
                                _.each(data3, function(user) {
                                    newreturns.push(user);
                                });
                                callback(null, newreturns);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        db.collection("artmedium").find({
                            $or: [{
                                name: {
                                    $regex: checkname
                                }
                            }, {
                                name: {
                                    $regex: check
                                }
                            }],
                        }, {
                            _id: 0,
                            name: 1
                        }).sort({
                            name: 1
                        }).limit(10).toArray(function(err, data4) {
                            if (data4 && data4[0]) {
                                _.each(data4, function(user) {
                                    user.type = "Art-medium";
                                    newreturns.push(user);
                                });
                                callback(null, newreturns);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        db.collection("tag").find({
                            $or: [{
                                name: {
                                    $regex: checkname
                                }
                            }, {
                                name: {
                                    $regex: check
                                }
                            }],
                        }, {
                            _id: 0,
                            name: 1
                        }).sort({
                            name: 1
                        }).limit(10).toArray(function(err, data5) {
                            if (data5 && data5[0]) {
                                _.each(data5, function(user) {
                                    user.type = "Tag";
                                    newreturns.push(user);
                                });
                                callback(null, newreturns);
                            } else if (err) {
                                console.log(err);
                                callback(err, null);
                            } else {
                                callback(null, newreturns);
                            }
                        });
                    },
                ], function(err, data6) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (data6) {
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
        });
    },
    favoriteartwork: function(data, callback) {
        var i = 0;
        var returnData = [];
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                _.each(data.artwork, function(art) {
                    Artwork.findbyid(art, function(respo) {
                        if (respo.value != false) {
                            if (art.wishlistfolder) {
                                respo[0].wishlistfolder = art.wishlistfolder;
                            }
                            returnData.push(respo[0]);
                            i++;
                            if (i == data.artwork.length) {
                                callback(returnData);
                                db.close();
                            }
                        } else {
                            i++;
                        }
                    });
                });
            }
        });
    },
    nextartwork: function(data, callback) {
        if (data.type && data.type == "prev") {
            var mysr = parseInt(data.srno) - 1;

            function callminus() {
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
                                accesslevel: "artist"
                            }
                        }, {
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                "artwork.srno": mysr,
                                $or: [{
                                    "artwork.status": "approve"
                                }, {
                                    "artwork.status": "sold"
                                }]
                            }
                        }, {
                            $project: {
                                _id: 1,
                                name: 1,
                                artwork: 1,
                                focused: 1
                            }
                        }]).sort({
                            focused: 1,
                            name: 1,
                            "artwork.srno": 1
                        }).toArray(function(err, found) {
                            if (found && found[0]) {
                                callback(found[0]);
                                db.close();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else {
                                mysr = mysr - 1;
                                Artwork.lastsr(data, function(srespo) {
                                    if (mysr < srespo.srno && mysr > 0) {
                                        callminus();
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "No data found"
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            Artwork.lastsr(data, function(srespo) {
                if (mysr < srespo.srno && mysr > 0) {
                    callminus();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                }
            });
        } else {
            var mysr = parseInt(data.srno) + 1;

            function callplus() {
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
                                accesslevel: "artist"
                            }
                        }, {
                            $unwind: "$artwork"
                        }, {
                            $match: {
                                "artwork.srno": mysr,
                                $or: [{
                                    "artwork.status": "approve"
                                }, {
                                    "artwork.status": "sold"
                                }]
                            }
                        }, {
                            $project: {
                                _id: 1,
                                name: 1,
                                artwork: 1,
                                focused: 1
                            }
                        }]).sort({
                            focused: 1,
                            name: 1,
                            "artwork.srno": 1
                        }).toArray(function(err, found) {
                            if (found && found[0]) {
                                callback(found[0]);
                                db.close();
                            } else if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else {
                                mysr = mysr + 1;
                                Artwork.lastsr(data, function(srespo) {
                                    if (mysr < srespo.srno && mysr > 0) {
                                        callplus();
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "No data found"
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            Artwork.lastsr(data, function(srespo) {
                if (mysr < srespo.srno && mysr > 0) {
                    callplus();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                }
            });
        }
    },
    findMyArtwork: function(data, callback) {
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
                    $unwind: "$artwork.reseller"
                }, {
                    $match: {
                        "artwork.reseller._id": sails.ObjectID(data.user)
                    }
                }, {
                    $project: {
                        name: 1,
                        artwork: 1
                    }
                }]).toArray(function(err, found) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
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
