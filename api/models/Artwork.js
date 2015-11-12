/**
 * Artwork.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var user = sails.ObjectID(data.user);
                delete data.user;
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
                    "artwork.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].artwork && data2[0].artwork[0]) {
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
                        _id: user,
                        "artwork.name": {
                            $exists: true
                        }
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
                        }
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
                        }
                    };
                    callbackfunc1();
                }

                function callbackfunc1() {
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
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork._id": sails.ObjectID(data._id)
                    }
                }, {
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork._id": sails.ObjectID(data._id)
                    }
                }, {
                    $project: {
                        name: 1,
                        artwork: 1
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
        data._id = sails.ObjectID(data._id);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").update({
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
                if (data.type && data.type != "") {
                    var matchobj = {
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork.name": {
                            $regex: check
                        },
                        "artwork.type": data.type
                    };
                    callbackfunc1();
                } else {
                    var matchobj = {
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork.name": {
                            $regex: check
                        }
                    };
                    callbackfunc1();
                }

                function callbackfunc1() {
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
                    $match: {
                        "artwork.name": {
                            $exists: true
                        }
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
                    $group: {
                        _id: user,
                        count: {
                            $last: "$artwork.srno"
                        }
                    }
                }, {
                    $project: {
                        count: 1
                    }
                }]).toArray(function(err, result) {
                    if (result && result[0]) {
                        callback(result);
                        db.close();
                    } else if (!result[0]) {
                        callback([{
                            count: 0
                        }]);
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
                var checkmedium = new RegExp(data.medium, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                var sortnum = parseInt(data.sort);
                var sort = {};
                sort['artwork.' + data.filter] = sortnum;

                if (data.type == "") {
                    if (data.minbreadth == 0 && data.maxbreadth == 10000) {
                        if (data.minwidth == 0 && data.maxwidth == 10000 && data.minprice == 0 && data.maxprice == 10000000 && data.minheight == 0 && data.maxheight == 10000) {
                            var matchobj = {
                                name: {
                                    $regex: check
                                },
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.subtype.name": {
                                    $regex: checkmedium
                                }
                            };
                            callbackfunc1();
                        } else {
                            var matchobj = {
                                name: {
                                    $regex: check
                                },
                                "artwork.name": {
                                    $exists: true
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
                                "artwork.subtype.name": {
                                    $regex: checkmedium
                                }
                            };
                            callbackfunc1();
                        }
                    } else {
                        var matchobj = {
                            name: {
                                $regex: check
                            },
                            "artwork.name": {
                                $exists: true
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
                            },
                            "artwork.subtype.name": {
                                $regex: checkmedium
                            }
                        };
                        callbackfunc1();
                    }
                } else if (data.type != "Sculptures") {
                    if (data.minwidth == 0 && data.maxwidth == 10000 && data.minprice == 0 && data.maxprice == 10000000 && data.minheight == 0 && data.maxheight == 10000) {
                        var matchobj = {
                            name: {
                                $regex: check
                            },
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.type": data.type,
                            "artwork.subtype.name": {
                                $regex: checkmedium
                            }
                        };
                        callbackfunc1();
                    } else {
                        var matchobj = {
                            name: {
                                $regex: check
                            },
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.type": data.type,
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
                            "artwork.subtype.name": {
                                $regex: checkmedium
                            }
                        };
                        callbackfunc1();
                    }
                } else if (data.type == "Sculptures") {
                    if (data.minwidth == 0 && data.maxwidth == 10000 && data.minprice == 0 && data.maxprice == 10000000 && data.minheight == 0 && data.maxheight == 10000 && data.minbreadth == 0 && data.maxbreadth == 10000) {
                        var matchobj = {
                            name: {
                                $regex: check
                            },
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.type": data.type,
                            "artwork.subtype.name": {
                                $regex: checkmedium
                            }
                        };
                        callbackfunc1();
                    } else {
                        var matchobj = {
                            name: {
                                $regex: check
                            },
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.type": data.type,
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
                            },
                            "artwork.subtype.name": {
                                $regex: checkmedium
                            }
                        };
                        callbackfunc1();
                    }
                }

                function callbackfunc1() {
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
    searchartwork: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                var i = 0;
                var newreturns = {};
                newreturns.data = [];
                var checkname = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                db.collection("user").aggregate([{
                    $match: {
                        name: {
                            $regex: checkname
                        },
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
                        callbackfunc();
                    }
                });

                function callbackfunc() {
                    db.collection("user").aggregate([{
                        $match: {
                            name: {
                                $regex: checkname
                            },
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
                            _.each(found, function(user) {
                                newreturns.data.push(user);
                            });
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        }
                    });
                }
                db.collection("user").aggregate([{
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork.name": {
                            $regex: checkname
                        }
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

                function callbackfunc1() {
                    db.collection("user").aggregate([{
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            "artwork.name": {
                                $regex: checkname
                            }
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
                            _.each(found, function(user) {
                                newreturns.data.push(user);
                            });
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        }
                    });
                }
                db.collection("user").aggregate([{
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork.subtype.name": {
                            $regex: checkname
                        }
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
                        callbackfunc2();
                    }
                });

                function callbackfunc2() {
                    db.collection("user").aggregate([{
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            "artwork.subtype.name": {
                                $regex: checkname
                            }
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
                            _.each(found, function(user) {
                                newreturns.data.push(user);
                            });
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        }
                    });
                }
                db.collection("user").aggregate([{
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork.tag.name": {
                            $regex: checkname
                        }
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

                function callbackfunc3() {
                    db.collection("user").aggregate([{
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            "artwork.tag.name": {
                                $regex: checkname
                            }
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
                            _.each(found, function(user) {
                                newreturns.data.push(user);
                            });
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            i++;
                            if (i == 4) {
                                callback(newreturns);
                                db.close();
                            }
                        }
                    });
                }
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
                        if (respo.value && respo.value != false) {
                            i++;
                        } else {
                            i++;
                            returnData.push(respo[0]);
                            if (i == data.artwork.length) {
                                callback(returnData);
                                db.close();
                            }
                        }
                    });
                });
            }
        });
    }
};
