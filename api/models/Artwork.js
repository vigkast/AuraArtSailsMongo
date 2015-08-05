/**
 * Artwork.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var user = sails.ObjectID(data.user);
        delete data.user;
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    if (!data.creationtime) {
                        data.creationtime = data._id.getTimestamp();
                    }
                    data.modifytime = data.creationtime;
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            artwork: data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            callback({
                                value: true
                            });
                        }
                    });
                }
            });
        } else {
            data._id = sails.ObjectID(data._id);
            if (!data.modifytime) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
            }
            var tobechanged = {};
            var attribute = "artwork.$.";
            _.forIn(data, function (value, key) {
                tobechanged[attribute + key] = value;
            });

            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {

                    db.collection("user").update({
                        "_id": user,
                        "artwork._id": data._id
                    }, {
                        $set: tobechanged
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            callback({
                                value: true
                            });
                        }
                    });
                }
            });
        }
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
                    "artwork._id": data._id
                }, {
                    $set: {
                        "artwork.$": data
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (updated) {
                        callback({
                            value: true
                        });
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
                    "artwork._id": sails.ObjectID(data._id)
                }, {
                    "artwork.$": 1
                }).each(function (err, data2) {
                    if (data2 != null) {
                        callback(data2.artwork[0]);
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
                            "artwork.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$artwork"
                    },
                    {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $project: {
                            artwork: 1
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
    findall: function (data, callback) {
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
                            "artwork.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$artwork"
                    },
                    {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $project: {
                            artwork: 1
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
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $unwind: "$artwork"
                    },
                    {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
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
                    if (result[0]) {
                        newreturns.total = result[0].count;
                        newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                        newcallback++;
                    }
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                });
                db.collection("user").aggregate([
                    {
                        $match: {
                            _id: user,
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $unwind: "$artwork"
                    },
                    {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $project: {
                            artwork: 1
                        }
                    }
                ]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
                    function (err, found) {
                        if (found != null) {
                            newreturns.data = found;
                            callback(newreturns);

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
    localtoserver: function (data, callback) {
        if (data.creationtime) {
            artwork.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            artwork.delete(data, callback)
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
                            "artwork.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $unwind: "$artwork"
                    },
                    {
                        $match: {
                            "artwork.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $project: {
                            artwork: 1
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