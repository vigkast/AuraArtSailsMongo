/**
 * Artwork.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (data.user && sails.ObjectID.isValid(data.user)) {
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
                                    comment: "No Such Artwork"
                                });
                                db.close();
                            }
                        });
                    } else {
                        if (data._id && sails.ObjectID.isValid(data._id)) {
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
                                    db.close();
                                } else if (updated) {
                                    callback({
                                        value: true
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: false,
                                        comment: "No Such Artwork"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            callback({
                                value: false,
                                comment: "ArtworkID incorrect."
                            });
                            db.close();
                        }
                    }
                } else {
                    callback({
                        value: false,
                        comment: "UserID Incorrect"
                    });
                    db.close();
                }
            }
        });
    },
    delete: function (data, callback) {
        if (data.user && sails.ObjectID.isValid(data.user) && data._id && sails.ObjectID.isValid(data._id)) {
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
                        "_id": user
                    }, {
                        $pull: {
                            "artwork": {
                                "_id": sails.ObjectID(data._id)
                            }
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
                                comment: "No such Artwork."
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Userid or Artworkid incorrect."
            });
        }
    },
    findone: function (data, callback) {
        if (data.user && sails.ObjectID.isValid(data.user) && data._id && sails.ObjectID.isValid(data._id)) {
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
                    }).toArray(function (err, data2) {
                        if (data2 != null) {
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
                                comment: "No Such Artworkk."
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Userid or Artworkid incorrect."
            });
        }
    },
    find: function (data, callback) {
        if (data.user && sails.ObjectID.isValid(data.user)) {
            var user = sails.ObjectID(data.user);
            sails.query(function (err, db) {
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
        }]).toArray(function (err, data2) {
                        if (data2 != null) {
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
                                value: false
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Userid Incorrect."
            });
        }
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
                    $project: {
                        artwork: 1
                    }
        }]).toArray(function (err, data2) {
                    if (data2 != null) {
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
                            comment: "No data found."
                        });
                    }
                });
            }
        });
    },
    findlimited: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (data.user && sails.ObjectID.isValid(data.user)) {
                    var newcallback = 0;
                    var newreturns = {};
                    var check = new RegExp(data.search, "i");
                    var pagesize = data.pagesize;
                    var pagenumber = data.pagenumber;
                    var user = sails.ObjectID(data.user);
                    var sortnum = parseInt(data.sort);
                    var sort = {};
                    sort['artwork.' + data.filter] = sortnum;
                    if (data.type != "") {

                        db.collection("user").aggregate([{
                            $match: {
                                _id: user,
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.type": data.type,
                                "artwork.name": {
                                    $regex: check
                                }
                            }
          }, {
                            $unwind: "$artwork"
          }, {
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.type": data.type,
                                "artwork.name": {
                                    $regex: check
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
          }]).toArray(function (err, result) {
                            if (result[0]) {
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
                                    comment: "Count of null."
                                });
                                db.close();
                            }
                        });

                        function callbackfunc() {
                            db.collection("user").aggregate([{
                                $match: {
                                    _id: user,
                                    "artwork.name": {
                                        $exists: true
                                    },
                                    "artwork.type": data.type,
                                    "artwork.name": {
                                        $regex: check
                                    }
                                }
          }, {
                                $unwind: "$artwork"
          }, {
                                $match: {
                                    "artwork.name": {
                                        $exists: true
                                    },
                                    "artwork.type": data.type,
                                    "artwork.name": {
                                        $regex: check
                                    }
                                }
          }, {
                                $project: {
                                    artwork: 1
                                }
          }, {
                                $sort: sort
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
                                        comment: "No data found."
                                    });
                                    db.close();
                                }
                            });
                        }
                    } else {
                        db.collection("user").aggregate([{
                            $match: {
                                _id: user,
                                "artwork.name": {
                                    $exists: true
                                },

                                "artwork.name": {
                                    $regex: check
                                }
                            }
          }, {
                            $unwind: "$artwork"
          }, {
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": {
                                    $regex: check
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
          }]).toArray(function (err, result) {
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
                                callback({
                                    value: false,
                                    comment: "Count of null"
                                });
                                db.close();
                            }
                        });

                        function callbackfunc1() {
                            db.collection("user").aggregate([{
                                $match: {
                                    _id: user,
                                    "artwork.name": {
                                        $exists: true
                                    },
                                    "artwork.name": {
                                        $regex: check
                                    }
                                }
          }, {
                                $unwind: "$artwork"
          }, {
                                $match: {
                                    "artwork.name": {
                                        $exists: true
                                    },
                                    "artwork.name": {
                                        $regex: check
                                    }
                                }
          }, {
                                $project: {
                                    artwork: 1
                                }
          }, {
                                $sort: sort
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
                                        comment: "No data found."
                                    });
                                    db.close();
                                }
                            });
                        }
                    }
                } else {
                    callback({
                        value: false,
                        comment: "UserID incorrect."
                    });
                    db.close();
                }
            }
        });
    },
    findhome: function (data, callback) {
        var check = new RegExp(data.search, "g");
        sails.query(function (err, db) {
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
                        "artwork.type": {
                            $regex: check
                        },
                        "accesslevel": "artist"
                    }
        }, {
                    $unwind: "$artwork"
        }, {
                    $match: {
                        "artwork.name": {
                            $exists: true
                        },
                        "artwork.type": {
                            $regex: check
                        },
                        "accesslevel": "artist"
                    }
        }, {
                    $project: {
                        artwork: 1
                    }
        }]).toArray(function (err, found) {
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
                            comment: "No data found."
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findbyid: function (data, callback) {
        if (data._id && sails.ObjectID.isValid(data._id)) {
            sails.query(function (err, db) {
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
        }]).toArray(function (err, found) {
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
                                comment: "No data found."
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Artworkid incorrect."
            });
        }
    },
    deleteout: function (data, callback) {
        if (data._id && sails.ObjectID.isValid(data._id)) {
            data._id = sails.ObjectID(data._id);
            sails.query(function (err, db) {
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
                                comment: "No data found."
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Artworkid incorrect."
            });
        }
    },
    findlimitedout: function (data, callback) {
        sails.query(function (err, db) {
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
                if (data.type != "") {

                    db.collection("user").aggregate([{
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
                            },
                            "artwork.type": data.type
                        }
          }, {
                        $unwind: "$artwork"
          }, {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
                            },
                            "artwork.type": data.type
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
          }]).toArray(function (err, result) {
                        if (result && result[0]) {
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
                                comment: "Count of null."
                            });
                            db.close();
                        }
                    });

                    function callbackfunc() {
                        db.collection("user").aggregate([{
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": {
                                    $regex: check
                                },
                                "artwork.type": data.type
                            }
          }, {
                            $unwind: "$artwork"
          }, {
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": {
                                    $regex: check
                                },
                                "artwork.type": data.type
                            }
          }, {
                            $project: {
                                artwork: 1
                            }
          }, {
                            $sort: sort
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
                                    comment: "No data found."
                                });
                            }
                        });
                    }
                } else {
                    db.collection("user").aggregate([{
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
                            }
                        }
          }, {
                        $unwind: "$artwork"
          }, {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": {
                                $regex: check
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
          }]).toArray(function (err, result) {
                        if (result && result[0]) {
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                            callbackfunc1();
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

                    function callbackfunc1() {
                        db.collection("user").aggregate([{
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": {
                                    $regex: check
                                }
                            }
          }, {
                            $unwind: "$artwork"
          }, {
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": {
                                    $regex: check
                                }
                            }
          }, {
                            $project: {
                                artwork: 1
                            }
          }, {
                            $sort: sort
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
                                    comment: "No data found."
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    lastsr: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
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
        }]).toArray(function (err, result) {
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
                            comment: "No data found."
                        });
                        db.close();
                    }
                });
            }
        });
    },
    saveartwork: function (data) {
        if (data.user && sails.ObjectID.isValid(data.user)) {
            var user = sails.ObjectID(data.user);
            delete data.user;
            data._id = sails.ObjectID();
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
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
        } else {
            callback({
                value: false,
                comment: "Userid is not valid."
            });
        }
    },
    artworktype: function (data, callback) {
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
                if (data.type != "") {

                    db.collection("user").aggregate([{
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": check,
                            "artwork.type": data.type
                        }
          }, {
                        $unwind: "$artwork"
          }, {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": check,
                            "artwork.type": data.type
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
          }]).toArray(function (err, result) {
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
                            callback({
                                value: false,
                                comment: "Count of null."
                            });
                            db.close();
                        }
                    });

                    function callbackfunc1() {
                        db.collection("user").aggregate([{
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": check,
                                "artwork.type": data.type
                            }
          }, {
                            $unwind: "$artwork"
          }, {
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": check,
                                "artwork.type": data.type
                            }
          }, {
                            $project: {
                                name: 1,
                                artwork: 1
                            }
          }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(
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
                                        comment: "No data found."
                                    });
                                    db.close();
                                }
                            });
                    }
                } else {
                    db.collection("user").aggregate([{
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": check
                        }
          }, {
                        $unwind: "$artwork"
          }, {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            },
                            "artwork.name": check
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
                                comment: "No such data"
                            });
                            db.close();
                        }
                    });

                    function callbackfunc() {
                        db.collection("user").aggregate([{
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": check
                            }
          }, {
                            $unwind: "$artwork"
          }, {
                            $match: {
                                "artwork.name": {
                                    $exists: true
                                },
                                "artwork.name": check
                            }
          }, {
                            $project: {
                                name: 1,
                                artwork: 1
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
            }
        });
    }
};