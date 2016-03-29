/**
 * Wishlist.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        var user = sails.ObjectID(data.user);
        if (data.wishlistfolder) {
            data.wishlistfolder = sails.ObjectID(data.wishlistfolder);
        }
        if (data.artwork) {
            data.artwork = sails.ObjectID(data.artwork);
        }
        if (data.srno && data.srno != "") {
            data.srno = parseInt(data.srno);
        }
        delete data.user;
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
                    db.collection("user").find({
                        _id: user,
                        "wishlist.artwork": sails.ObjectID(data.artwork)
                    }, {
                        "wishlist.$": 1
                    }).toArray(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            data.user = user;
                            Wishlist.delete(data, function(data3) {
                                if (data3.value == true) {
                                    data._id = user;
                                    User.findone(data, callback);
                                } else {
                                    callback(data3);
                                }
                            });
                        } else {
                            db.collection("user").update({
                                _id: user
                            }, {
                                $push: {
                                    wishlist: data
                                }
                            }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                                    data._id = user;
                                    User.findone(data, callback);
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
            }
        });
    },
    saveForFolder: function(data, callback) {
        var user = sails.ObjectID(data.user);
        if (data.wishlistfolder) {
            data.wishlistfolder = sails.ObjectID(data.wishlistfolder);
        }
        if (data.artwork) {
            data.artwork = sails.ObjectID(data.artwork);
        }
        if (data.srno && data.srno != "") {
            data.srno = parseInt(data.srno);
        }
        delete data.user;
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
                            wishlist: data
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
                } else {
                    data._id = sails.ObjectID(data._id);
                    var tobechanged = {};
                    var attribute = "wishlist.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "wishlist._id": data._id
                    }, {
                        $set: tobechanged
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
    delete: function(data, callback) {
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
                        "wishlist": {
                            "artwork": sails.ObjectID(data.artwork)
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
                        data._id = user;
                        User.findone(data, callback);
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
                    "_id": user,
                    "wishlist._id": sails.ObjectID(data._id)
                }, {
                    "wishlist.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].wishlist && data2[0].wishlist[0]) {
                        callback(data2[0].wishlist[0]);
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
        var lastresult = [];
        var i = 0;
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
                    $unwind: "$wishlist"
                }, {
                    $group: {
                        _id: "$_id",
                        wishlist: {
                            $addToSet: "$wishlist"
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        wishlist: 1
                    }
                }, {
                    $unwind: "$wishlist"
                }]).toArray(function(err, data2) {
                    if (data2 && data2[0]) {
                        _.each(data2, function(z) {
                            lastresult.push(z.wishlist);
                            i++;
                            if (i == data2.length) {
                                callback(lastresult);
                                db.close();
                            }
                        });
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
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
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
                    $unwind: "$wishlist"
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
                            comment: "count of null"
                        });
                        db.close();
                    }
                });

                function callbackfunc() {
                    db.collection("user").aggregate([{
                        $match: {
                            _id: user
                        }
                    }, {
                        $unwind: "$wishlist"
                    }, {
                        $project: {
                            wishlist: 1
                        }
                    }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
                        function(err, found) {
                            if (found != null) {
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
        });
    }
};
