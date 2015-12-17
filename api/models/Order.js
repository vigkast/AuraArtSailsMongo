/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function(data, callback) {
        if (data.discountcoupon && data.discountcoupon != "") {
            data.discountcoupon = sails.ObjectID(data.discountcoupon);
        }
        if (data.cart && data.cart.length > 0) {
            _.each(data.cart, function(art) {
                art.artwork = sails.ObjectID(art.artwork);
            });
        }
        if (data.user) {
            data.user = sails.ObjectID(data.user);
        }
        sails.query(function(err, db) {
            var exit = 0;
            var exitup = 0;
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    var newdata = {};
                    newdata.status = "pending";
                    newdata._id = sails.ObjectID();
                    newdata.cart = data.cart;
                    newdata.user = data.user;
                    db.collection('order').insert(newdata, function(err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (created) {
                            if (data.orderid && data.orderid.length > 0) {
                                data.orderid.push({
                                    _id: newdata._id
                                });
                            } else {
                                data.orderid = [];
                                data.orderid.push({
                                    _id: newdata._id
                                });
                            }
                            data._id = data.user;
                            data.cart = [];
                            User.save(data, callback);
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                } else {
                    var order = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('order').update({
                        _id: order
                    }, {
                        $set: data
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
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("order").count({
                    artist: {
                        '$regex': check
                    }
                }, function(err, number) {
                    if (number && number != "") {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callbackfunc();
                    } else if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
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
                    db.collection("order").find({
                        artist: {
                            '$regex': check
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close()
                        } else if (found && found[0]) {
                            newreturns.data = found;
                            callback(newreturns);
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
    find: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                db.collection("order").count({
                    cart: {
                        $exists: true
                    }
                }, function(err, number) {
                    if (number && number != "") {
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        dbcall();
                    } else if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "Count of null"
                        });
                        db.close();
                    }
                });

                function dbcall() {
                    db.collection("order").find({
                        cart: {
                            $exists: true
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (found && found[0]) {
                            newreturns.total = found.length;
                            newreturns.data = found;
                            callback(newreturns);
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
    findone: function(data, callback) {
        var lastresult = [];
        var i = 0;
        var j = 0;
        var returnData = [];
        var order = sails.ObjectID(data._id);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("order").aggregate([{
                    $match: {
                        _id: order
                    }
                }, {
                    $unwind: "$cart"
                }, {
                    $group: {
                        _id: "$_id",
                        cart: {
                            $addToSet: "$cart"
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        cart: 1
                    }
                }, {
                    $unwind: "$cart"
                }]).toArray(function(err, data2) {
                    if (data2 && data2[0]) {
                        _.each(data2, function(z) {
                            lastresult.push(z.cart);
                            i++;
                            if (i == data2.length) {
                                _.each(lastresult, function(art) {
                                    Artwork.findbyid({
                                        _id: art.artwork
                                    }, function(respo) {
                                        if (respo.value && respo.value != false) {
                                            j++;
                                        } else {
                                            j++;
                                            returnData.push(respo[0]);
                                            if (j == lastresult.length) {
                                                callback(returnData);
                                                db.close();
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback([]);
                        db.close();
                    }
                });
            }
        });
    },
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('order').remove({
                _id: sails.ObjectID(data._id)
            }, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
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
        });
    }
};
