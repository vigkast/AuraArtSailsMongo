/**
 * Wishlistfolder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        var user = sails.ObjectID(data.user);
        delete data.user;
        if (data.srno && data.srno != "") {
            data.srno = parseInt(data.srno);
        }
        if (data.imageno && data.imageno != "") {
            data.imageno = parseInt(data.imageno);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            wishlistfolder: data
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
                    var tobechanged = {};
                    var attribute = "wishlistfolder.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "wishlistfolder._id": data._id
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
        if (data.srno && data.srno != "") {
            data.srno = parseInt(data.srno);
        }
        if (data.imageno && data.imageno != "") {
            data.imageno = parseInt(data.imageno);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").update({
                    _id: user
                }, {
                    $pull: {
                        "wishlistfolder": {
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
                    "_id": user,
                    "wishlistfolder._id": sails.ObjectID(data._id)
                }, {
                    "wishlistfolder.$": 1
                }).toArray(function(err, data2) {
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
    find: function(data, callback) {
        var lastresult = [];
        var i = 0;
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
                        _id: user
                    }
                }, {
                    $unwind: "$wishlistfolder"
                }, {
                    $group: {
                        _id: "$_id",
                        wishlistfolder: {
                            $addToSet: "$wishlistfolder"
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        wishlistfolder: 1
                    }
                }, {
                    $unwind: "$wishlistfolder"
                }]).toArray(function(err, data2) {
                    if (data2 && data2[0]) {
                        _.each(data2, function(z) {
                            lastresult.push(z.wishlistfolder);
                            i++;
                            if (i == data2.length) {
                                callback(lastresult);
                                db.close();
                            }
                        });
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
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
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
                        "wishlistfolder.name": {
                            $exists: true
                        },
                        "wishlistfolder.name": {
                            $regex: check
                        }
                    }
                }, {
                    $unwind: "$wishlistfolder"
                }, {
                    $match: {
                        "wishlistfolder.name": {
                            $exists: true
                        },
                        "wishlistfolder.name": {
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
                db.collection("user").aggregate([{
                    $match: {
                        _id: user,
                        "wishlistfolder.name": {
                            $exists: true
                        },
                        "wishlistfolder.name": {
                            $regex: check
                        }
                    }
                }, {
                    $unwind: "$wishlistfolder"
                }, {
                    $match: {
                        "wishlistfolder.name": {
                            $exists: true
                        },
                        "wishlistfolder.name": {
                            $regex: check
                        }
                    }
                }, {
                    $project: {
                        wishlistfolder: 1
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
        });
    },
    getWishlist: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else {
                db.collection("user").aggregate([{
                    $match: {
                        _id: sails.ObjectID(data.user)
                    }
                }, {
                    $unwind: "$wishlist"
                }, {
                    $match: {
                        "wishlist.wishlistfolder": sails.ObjectID(data.wishlistfolder)
                    }
                }, {
                    $project: {
                        _id: 0,
                        wishlist: 1
                    }
                }]).toArray(function(err, found) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (found && found.length > 0) {
                        var i = 0;
                        var lastresult = [];
                        _.each(found, function(z) {
                            lastresult.push(z.wishlist);
                            i++;
                            if (i == found.length) {
                                callback(lastresult);
                            }
                        });
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
    shareFolder: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Something went wrong. Please try again"
                });
            } else {
                db.collection("user").find({
                    email: data.email
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Something went wrong. Please try again"
                        });
                        db.close();
                    } else if (data2 && data2.length > 0) {
                        Wishlistfolder.getWishlist({
                            user: data.user,
                            wishlistfolder: data.wishlistfolder
                        }, function(getRespo) {
                            if (getRespo.value != false) {
                                Wishlistfolder.save({
                                    user: data2[0]._id,
                                    name: data.name
                                }, function(wishrespo) {
                                    if (wishrespo.value != false) {
                                        function callsave(num) {
                                            var abcd = getRespo[num];
                                            Wishlist.saveForFolder({
                                                user: data2[0]._id,
                                                wishlistfolder: wishrespo.id,
                                                artwork: abcd.artwork
                                            }, function(saveRespo) {
                                                num++;
                                                if (num == getRespo.length) {
                                                    callback({
                                                        value: true,
                                                        comment: "Folder shared"
                                                    });
                                                    db.close();
                                                } else {
                                                    callsave(num);
                                                }
                                            });
                                        }
                                        callsave(0);
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "Something went wrong. Please try again"
                                        });
                                        db.close();
                                    }
                                });
                            } else {
                                callback({
                                    value: false,
                                    comment: "No artworks found in your folder"
                                });
                                db.close();
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: "Email-Id is not registered  with Aura Art"
                        });
                        db.close();
                    }
                });
            }
        });
    }
};
