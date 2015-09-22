/**
 * Ticketelement.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var ticket = sails.ObjectID(data.ticket);
        var dummy = sails.ObjectID();
        data.timestamp = dummy.getTimestamp();
        data.user = sails.ObjectID(data.user);
        delete data.ticket;
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
                    db.collection("ticket").update({
                        _id: ticket
                    }, {
                        $push: {
                            ticketelement: data
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
                    var attribute = "ticketelement.$.";
                    _.forIn(data, function (value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("ticket").update({
                        "_id": ticket,
                        "ticketelement._id": data._id
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
                                value: true
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
        var ticket = sails.ObjectID(data.ticket);
        delete data.ticket;
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
                db.collection("ticket").update({
                    "_id": ticket,
                    "ticketelement._id": data._id
                }, {
                    $set: {
                        "ticketelement.$": data
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
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").find({
                    "_id": ticket,
                    "ticketelement._id": sails.ObjectID(data._id)
                }, {
                    "ticketelement.$": 1
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0] && data2[0].ticketelement && data2[0].ticketelement[0]) {
                        callback(data2[0].ticketelement[0]);
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
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").aggregate([
                    {
                        $match: {
                            _id: ticket,
                            "ticketelement.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$ticketelement"
                    },
                    {
                        $match: {
                            "ticketelement.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $project: {
                            ticketelement: 1
                        }
                    }
                ]).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
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
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").aggregate([
                    {
                        $match: {
                            _id: ticket,
                            "ticketelement.content": {
                                $exists: true
                            },
                            "ticketelement.content": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $unwind: "$ticketelement"
                    },
                    {
                        $match: {
                            "ticketelement.content": {
                                $exists: true
                            },
                            "ticketelement.content": {
                                $regex: check
                            }
                        }
                    },
                    {
                        $group: {
                            _id: ticket,
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

                function callbackfunc() {
                    db.collection("ticket").aggregate([
                        {
                            $match: {
                                _id: ticket,
                                "ticketelement.content": {
                                    $exists: true
                                },
                                "ticketelement.content": {
                                    $regex: check
                                }
                            }
                    },
                        {
                            $unwind: "$ticketelement"
                    },
                        {
                            $match: {
                                "ticketelement.content": {
                                    $exists: true
                                },
                                "ticketelement.content": {
                                    $regex: check
                                }
                            }
                    },
                        {
                            $project: {
                                ticketelement: 1
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
            }
        });
    },
    localtoserver: function (data, callback) {
        if (data.creationtime) {
            ticketelement.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            ticketelement.delete(data, callback)
        }
    },
    servertolocal: function (data, callback) {
        var d = new Date(data.modifytime);
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").aggregate([
                    {
                        $match: {
                            _id: ticket,
                            "ticketelement.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $unwind: "$ticketelement"
                    },
                    {
                        $match: {
                            "ticketelement.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $project: {
                            ticketelement: 1
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