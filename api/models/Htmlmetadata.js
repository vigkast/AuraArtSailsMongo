/**
 * Htmlmetadata.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        delete data.htmlpage;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();

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
                    var attribute = "metadata.$.";
                    _.forIn(data, function (value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("htmlpage").update({
                        "_id": htmlpage,
                        "metadata._id": data._id
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
        var htmlpage = sails.ObjectID(data.htmlpage);
        delete data.htmlpage;
        data._id = sails.ObjectID(data._id);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
                db.collection("htmlpage").update({
                    "_id": htmlpage,
                    "metadata._id": data._id
                }, {
                    $set: {
                        "metadata.$": data
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
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                db.collection("htmlpage").find({
                    "_id": htmlpage,
                    "metadata._id": sails.ObjectID(data._id)
                }, {
                    "metadata.$": 1
                }).toArray(function (err, data2) {
                    if (data2 && data2[0] && data2[0].metadata && data2[0].metadata[0]) {
                        callback(data2[0].metadata[0]);
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "Not data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function (err, db) {
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
                }]).toArray(function (err, data2) {
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
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function (err, db) {
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
                }]).toArray(function (err, result) {
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
                    }
                });

                function callbackfunc() {
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
                }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
            metadata.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            metadata.delete(data, callback)
        }
    },
    servertolocal: function (data, callback) {
        var d = new Date(data.modifytime);
        var htmlpage = sails.ObjectID(data.htmlpage);
        sails.query(function (err, db) {
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
                }]).toArray(function (err, data) {
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