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
                            wishlistfolder: data
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
                            console.log("updated");
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
            var attribute = "wishlistfolder.$.";
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
                        "wishlistfolder._id": data._id
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
                            console.log("updated");
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
                    }
                    if (updated) {
                        callback({
                            value: true
                        });
                        console.log(updated);
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
                }).each(function (err, data2) {
                    if (data2 != null) {
                        callback(data2.wishlistfolder[0]);
                        console.log("wishlistfolder findone");
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
                ]).toArray(
                    function (err, data) {
                        if (data != null) {
                            callback(data);
                            console.log(data);
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
        console.log(data.modifytime);
        var d = new Date(data.modifytime);
        console.log(d);
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
                            console.log(data);
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
    timebomb: function (data3, callback) {
        //        var returns = [];
        //        var d = new Date(data3.timebomb);
        //        var exit = 0;
        //        var exitdown = 0;
        //        var exitup = 0;
        //        sails.query(function (err, db) {
        //            if (err) {
        //                console.log(err);
        //                callback({
        //                    value: false
        //                });
        //            }
        //            if (db) {
        //                db.collection("user").aggregate([
        //                    {
        //                        $match: {
        //                            "wishlistfolder.timebomb": {
        //                                $lte: d
        //                            }
        //                        }
        //                    },
        //                    {
        //                        $unwind: "$wishlistfolder"
        //                    },
        //                    {
        //                        $match: {
        //                            "wishlistfolder.timebomb": {
        //                                $lte: d
        //                            }
        //                        }
        //                    },
        //                    {
        //                        $project: {
        //                            wishlistfolder: 1
        //                        }
        //                    }
        //                ]).each(function (err, data2) {
        //                    if (data2 != null) {
        //                        exitup++;
        //                        returns.push(data2.wishlistfolder._id);
        //                    } else {
        //                        exit++;
        //                        if (exit == exitup) {
        //                            console.log(exitup);
        //                            console.log(exit);
        //                            if (returns != "") {
        //                                for (var i = 0; i < returns.length; i++) {
        //                                    var data = {};
        //                                    data._id = sails.ObjectID(returns[i]);
        //                                    console.log(data._id);
        //                                    var dummy = sails.ObjectID();
        //                                    data.modifytime = dummy.getTimestamp();
        //                                    db.collection("user").update({
        //                                        "wishlistfolder._id": data._id
        //                                    }, {
        //                                        $set: {
        //                                            'wishlistfolder.$.folder': ''
        //                                        }
        //                                    }, function (err, updated) {
        //                                        if (err) {
        //                                            console.log(err);
        //                                            callback({
        //                                                value: false
        //                                            });
        //                                        }
        //                                        if (updated) {
        //                                            callback({
        //                                                value: true
        //                                            });
        //                                            console.log("data");
        //                                        }
        //                                    });
        //                                }
        //                            }
        //                            if (returns == "") {
        //                                callback("No timebombs.");
        //                            }
        //                        }
        //                    }
        //                    if (data2 == null) {
        //                        if (exit != exitup) {
        //                            console.log("No Timebombs.");
        //                            callback("No Timebombs.")
        //                        }
        //                    }
        //                    if (err) {
        //                        console.log(err);
        //                        callback({
        //                            value: false
        //                        });
        //                    }
        //                });
        //            }
        //        });
    }
};