/**
 * Medium.js
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
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("medium").find({
                        "name": data.name
                    }).toArray(function(err, data2) {
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
                            db.collection('medium').insert(data, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (created) {
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
                        }
                    });
                } else {
                    var medium = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('medium').update({
                        _id: medium
                    }, {
                        $set: data
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
                db.collection("medium").count({
                    name: {
                        '$regex': check
                    }
                }, function(err, number) {
                    if (number && number != "") {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
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
                    db.collection("medium").find({
                        name: {
                            '$regex': check
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
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
        var returns = [];
        var exit = 0;
        var exitup = 1;
        var check = new RegExp(data.search, "i");

        function callback2(exit, exitup, data) {
            if (exit == exitup) {
                callback(data);
            }
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("medium").find({
                    name: {
                        '$regex': check
                    }
                }).limit(10).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                    }
                    if (found != null) {
                        exit++;
                        if (data.medium.length != 0) {
                            var nedata;
                            nedata = _.remove(found, function(n) {
                                var flag = false;
                                _.each(data.medium, function(n1) {
                                    if (n1.name == n.name) {
                                        flag = true;
                                    }
                                })
                                return flag;
                            });
                        }
                        returns = returns.concat(found);
                        callback2(exit, exitup, returns);
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
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("medium").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
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
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('medium').remove({
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