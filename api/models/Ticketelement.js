/**
 * Ticketelement.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        delete data.client;
        delete data.artist;
        var ticket = sails.ObjectID(data.ticket);
        delete data.ticket;
        data.timestamp = new Date();
        var insertobj = {};
        if (data.status == 2 || data.status == 4 || (data.status == 5 && data.type == 2)) {
            insertobj = {
                "ticketelement.client": data
            };
        } else if (data.status == 1 || data.status == 3 || (data.status == 5 && data.type == 1)) {
            insertobj = {
                "ticketelement.artist": data
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
                data._id = sails.ObjectID();
                db.collection("ticket").update({
                    _id: ticket
                }, {
                    $push: insertobj
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
                            comment: "Not created"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function(data, callback) {
        var ticket = sails.ObjectID(data.ticket);
        delete data.ticket;
        data._id = sails.ObjectID(data._id);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").update({
                    _id: ticket
                }, {
                    $pull: {
                        "ticketelement": {
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
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function(err, db) {
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
                }).toArray(function(err, data2) {
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
    find: function(data, callback) {
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").aggregate([{
                    $match: {
                        _id: ticket,
                        "ticketelement.name": {
                            $exists: true
                        }
                    }
                }, {
                    $unwind: "$ticketelement"
                }, {
                    $match: {
                        "ticketelement.name": {
                            $exists: true
                        }
                    }
                }, {
                    $project: {
                        ticketelement: 1
                    }
                }]).toArray(function(err, data2) {
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
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        var ticket = sails.ObjectID(data.ticket);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").aggregate([{
                    $match: {
                        _id: ticket,
                        "ticketelement.content": {
                            $exists: true
                        },
                        "ticketelement.content": {
                            $regex: check
                        }
                    }
                }, {
                    $unwind: "$ticketelement"
                }, {
                    $match: {
                        "ticketelement.content": {
                            $exists: true
                        },
                        "ticketelement.content": {
                            $regex: check
                        }
                    }
                }, {
                    $group: {
                        _id: ticket,
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
                    db.collection("ticket").aggregate([{
                        $match: {
                            _id: ticket,
                            "ticketelement.content": {
                                $exists: true
                            },
                            "ticketelement.content": {
                                $regex: check
                            }
                        }
                    }, {
                        $unwind: "$ticketelement"
                    }, {
                        $match: {
                            "ticketelement.content": {
                                $exists: true
                            },
                            "ticketelement.content": {
                                $regex: check
                            }
                        }
                    }, {
                        $project: {
                            ticketelement: 1
                        }
                    }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
                        function(err, found) {
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
    }
};
