/**
 * Discountcoupon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function (data, callback) {
        if (!data._id) {
            data._id = sails.ObjectID();
            if (!data.creationtime) {
                data.creationtime = data._id.getTimestamp();
            }
            data.modifytime = data.creationtime;
            sails.query(function (err, db) {
                var exit = 0;
                var exitup = 0;
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                var cdiscountcoupon = db.collection('discountcoupon').insert(data, function (err, created) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (created) {
                        console.log("created");
                        callback({
                            value: true
                        });
                    }
                });
            });
        } else {
            sails.query(function (err, db) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
                var discountcoupon = sails.ObjectID(data._id);
                delete data._id
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    var cdiscountcoupon = db.collection('discountcoupon').update({
                        _id: discountcoupon
                    }, {
                        $set: data
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            console.log(updated);
                            callback({
                                value: true
                            });
                        }
                    });
                }
            });
        }
    },
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("discountcoupon").count({
                    name: {
                        '$regex': check
                    }
                }, function (err, number) {
                    newreturns.total = number;
                    newreturns.totalpages = Math.ceil(number / data.pagesize);
                    newcallback++;
                    if (newcallback == 2) {
                        callback(newreturns);
                    }

                });
                db.collection("discountcoupon").find({
                    name: {
                        '$regex': check
                    }
                }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (found != null) {
                        newreturns.data.push(found);
                    } else {
                        if (found == null) {
                            console.log(newreturns.data);
                            newcallback++;
                            if (newcallback == 2) {
                                callback(newreturns);
                            }
                        }
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        var returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("discountcoupon").find({}, {}).each(function (err, found) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (found != null) {
                        returns.push(found);
                    } else {
                        if (found == null) {
                            callback(returns);
                        }
                    }
                });
            }
        });
    },
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("discountcoupon").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        console.log(data);
                        callback(data);
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cdiscountcoupon = db.collection('discountcoupon').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
                    console.log(deleted);
                    callback({
                        value: true
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
            });
        });
    },
    countdiscountcoupon: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("discountcoupon").count({}, function (err, number) {
                    if (number != null) {
                        callback(number);
                    }
                });
            }
        });
    }
};