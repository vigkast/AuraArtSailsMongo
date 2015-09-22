/**
 * Wishlist.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var user = sails.ObjectID(data.user);
        if (data.wishlistfolder) {
            data.wishlistfolder = sails.ObjectID(data.wishlistfolder);
        }
        if (data.artwork) {
            data.artwork = sails.ObjectID(data.artwork);
        }
        delete data.user;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    if (!data.creationtime) {
                        data.creationtime = data._id.getTimestamp();
                    }
                    data.modifytime = data.creationtime;
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            wishlist: data
                        }
                    }, function (err, updated) {
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
                    if (!data.modifytime) {
                        var dummy = sails.ObjectID();
                        data.modifytime = dummy.getTimestamp();
                    }
                    var tobechanged = {};
                    var attribute = "wishlist.$.";
                    _.forIn(data, function (value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "wishlist._id": data._id
                    }, {
                        $set: tobechanged
                    }, function (err, updated) {
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
                                comment: "Not updated"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    delete: function (data, callback) {
        var user = sails.ObjectID(data.user);
        delete data.user;
        data._id = sails.ObjectID(data._id);
        sails.query(function (err, db) {
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
                    "_id": user,
                    "wishlist._id": data._id
                }, {
                    $set: {
                        "wishlist.$": data
                    }
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
                            value: false,
                            comment: "Not deleted"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findOne: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
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
                }).toArray(function (err, data2) {
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
    find: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            _id: user,
                            "wishlist.comment": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$wishlist"
                    },
                    {
                        $match: {
                            "wishlist.comment": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $project: {
                            wishlist: 1
                        }
                    }
                ]).toArray(function (err, data2) {
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
                        db.close();
                    }
                });
            }
        });
    },
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            _id: user,
                            "wishlist.comment": {
                                $exists: true
                            },
                            "wishlist.comment": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $unwind: "$wishlist"
                    },
                    {
                        $match: {
                            "wishlist.comment": {
                                $exists: true
                            },
                            "wishlist.comment": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                    db.collection("user").aggregate([
                        {
                            $match: {
                                _id: user,
                                "wishlist.comment": {
                                    $exists: true
                                },
                                "wishlist.comment": {
                                    $regex: check
                                }
                            }
                    },
                        {
                            $unwind: "$wishlist"
                    },
                        {
                            $match: {
                                "wishlist.comment": {
                                    $exists: true
                                },
                                "wishlist.comment": {
                                    $regex: check
                                }
                            }
                    },
                        {
                            $project: {
                                wishlist: 1
                            }
                    }
                ]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
                        function (err, found) {
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
    },
    localtoserver: function (data, callback) {
        if (data.creationtime) {
            wishlist.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            wishlist.delete(data, callback)
        }
    },
    servertolocal: function (data, callback) {
        var d = new Date(data.modifytime);
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            _id: user,
                            "wishlist.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $unwind: "$wishlist"
                    },
                    {
                        $match: {
                            "wishlist.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $project: {
                            wishlist: 1
                        }
                    }
                ]).toArray(
                    function (err, data) {
                        if (data != null) {
                            callback(data);
                        }
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                    });
            }
        });
    }
};