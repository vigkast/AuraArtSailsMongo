/**
 * Wishlistfolder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var user = sails.ObjectID(data.user);
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
                            wishlistfolder: data
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
                    var attribute = "wishlistfolder.$.";
                    _.forIn(data, function (value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "wishlistfolder._id": data._id
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
                    "wishlistfolder._id": data._id
                }, {
                    $set: {
                        "wishlistfolder.$": data
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
                    "wishlistfolder._id": sails.ObjectID(data._id)
                }, {
                    "wishlistfolder.$": 1
                }).toArray(function (err, data2) {
                    if (data2 && data2[0] && data2[0].wishlistfolder && data2[0].wishlistfolder[0]) {
                        callback(data2[0].wishlistfolder[0]);
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
                            "wishlistfolder.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$wishlistfolder"
                    },
                    {
                        $match: {
                            "wishlistfolder.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $project: {
                            wishlistfolder: 1
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
                            "wishlistfolder.name": {
                                $exists: true
                            },
                            "wishlistfolder.name": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $unwind: "$wishlistfolder"
                    },
                    {
                        $match: {
                            "wishlistfolder.name": {
                                $exists: true
                            },
                            "wishlistfolder.name": {
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
                            comment: "Count of null"
                        });
                        db.close();
                    }
                });
                db.collection("user").aggregate([
                    {
                        $match: {
                            _id: user,
                            "wishlistfolder.name": {
                                $exists: true
                            },
                            "wishlistfolder.name": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $unwind: "$wishlistfolder"
                    },
                    {
                        $match: {
                            "wishlistfolder.name": {
                                $exists: true
                            },
                            "wishlistfolder.name": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $project: {
                            wishlistfolder: 1
                        }
                    }
                ]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
                    function (err, found) {
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
        });
    },
    localtoserver: function (data, callback) {
        if (data.creationtime) {
            wishlistfolder.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            wishlistfolder.delete(data, callback)
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
                            "wishlistfolder.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $unwind: "$wishlistfolder"
                    },
                    {
                        $match: {
                            "wishlistfolder.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $project: {
                            wishlistfolder: 1
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
    },
    accessfolder: function (data, callback) {
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
                    "wishlistfolder._id": sails.ObjectID(data._id),
                    "wishlistfolder.password": data.password
                }, {
                    "wishlistfolder.$": 1
                }).toArray(function (err, data2) {
                    if (data2 && data2[0]) {
                        callback(data2[0].wishlistfolder[0]);
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
};