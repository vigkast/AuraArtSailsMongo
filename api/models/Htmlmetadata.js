/**
 * Htmlmetadata.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        delete data.htmlpage;
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function(err, db) {
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
                    db.collection("htmlpage").update({
                        _id: htmlpage
                    }, {
                        $push: {
                            metadata: data
                        }
                    }, function(err, updated) {
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
            var attribute = "metadata.$.";
            _.forIn(data, function(value, key) {
                tobechanged[attribute + key] = value;
            });

            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {

                    db.collection("htmlpage").update({
                        "_id": htmlpage,
                        "metadata._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
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
    delete: function(data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        delete data.htmlpage;
        data._id = sails.ObjectID(data._id);
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
                db.collection("htmlpage").update({
                    "_id": htmlpage,
                    "metadata._id": data._id
                }, {
                    $set: {
                        "metadata.$": data
                    }
                }, function(err, updated) {
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
    findOne: function(data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("htmlpage").find({
                    "_id": htmlpage,
                    "metadata._id": sails.ObjectID(data._id)
                }, {
                    "metadata.$": 1
                }).each(function(err, data2) {
                    if (data2 != null) {
                        callback(data2.metadata[0]);
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
    find: function(data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("htmlpage").aggregate([{
                    $match: {
                        _id: htmlpage,
                        "metadata.keyword": {
                            $exists: true
                        }
                    }
                }, {
                    $unwind: "$metadata"
                }, {
                    $match: {
                        "metadata.keyword": {
                            $exists: true
                        }
                    }
                }, {
                    $project: {
                        metadata: 1
                    }
                }]).toArray(
                    function(err, data) {
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
    findall: function(data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("htmlpage").aggregate([{
                    $match: {
                        "metadata.name": {
                            $exists: true
                        }
                    }
                }, {
                    $unwind: "$metadata"
                }, {
                    $match: {
                        "metadata.name": {
                            $exists: true
                        }
                    }
                }, {
                    $project: {
                        metadata: 1
                    }
                }]).toArray(
                    function(err, data) {
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
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("htmlpage").aggregate([{
                    $match: {
                        _id: htmlpage,
                        "metadata.keyword": {
                            $exists: true
                        },
                        "metadata.keyword": {
                            $regex: check
                        }
                    }
                }, {
                    $unwind: "$metadata"
                }, {
                    $match: {
                        "metadata.keyword": {
                            $exists: true
                        },
                        "metadata.keyword": {
                            $regex: check
                        }
                    }
                }, {
                    $group: {
                        _id: htmlpage,
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
                db.collection("htmlpage").aggregate([{
                    $match: {
                        _id: htmlpage,
                        "metadata.keyword": {
                            $exists: true
                        },
                        "metadata.keyword": {
                            $regex: check
                        }
                    }
                }, {
                    $unwind: "$metadata"
                }, {
                    $match: {
                        "metadata.keyword": {
                            $exists: true
                        },
                        "metadata.keyword": {
                            $regex: check
                        }
                    }
                }, {
                    $project: {
                        metadata: 1
                    }
                }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
                    function(err, found) {
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
    localtoserver: function(data, callback) {
        if (data.creationtime) {
            metadata.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            metadata.delete(data, callback)
        }
    },
    servertolocal: function(data, callback) {
        var d = new Date(data.modifytime);
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("htmlpage").aggregate([{
                    $match: {
                        _id: htmlpage,
                        "metadata.modifytime": {
                            $gt: d
                        }
                    }
                }, {
                    $unwind: "$metadata"
                }, {
                    $match: {
                        "metadata.modifytime": {
                            $gt: d
                        }
                    }
                }, {
                    $project: {
                        metadata: 1
                    }
                }]).toArray(
                    function(err, data) {
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