/**
 * Tag.js
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
                    db.collection("tag").find({
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
                            db.collection('tag').insert(data, function(err, created) {
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
                    var tag = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('tag').update({
                        _id: tag
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
                if (data.category != "") {
                    db.collection("tag").count({
                        name: {
                            '$regex': check
                        },
                        category: data.category
                    }, function(err, number) {
                        if (number) {
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
                        db.collection("tag").find({
                            name: {
                                '$regex': check
                            },
                            category: data.category
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
                } else {
                    db.collection("tag").count({
                        name: {
                            '$regex': check
                        }
                    }, function(err, number) {
                        if (number) {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
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
                        db.collection("tag").find({
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
            }
        });
    },
    find: function(data, callback) {
        var returns = [];
        var exit = 0;
        var exitup = 2;
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
                db.collection("tag").find({
                    name: {
                        '$regex': check
                    },
                    category: data.category
                }).limit(10).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                        db.close();
                    } else if (found != null) {
                        exit++;
                        if (data.tag.length != 0) {
                            var nedata;
                            nedata = _.remove(found, function(n) {
                                var flag = false;
                                _.each(data.tag, function(n1) {
                                    if (n1.name == n.name) {
                                        flag = true;
                                    }
                                })
                                return flag;
                            });
                        }
                        returns = found;
                        newcallback();
                    } else {
                        exit++;
                        newcallback();
                    }
                });

                function newcallback() {
                    db.collection("tag").find({
                        name: {
                            '$regex': check
                        }
                    }).limit(10).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found != null) {
                            exit++;
                            if (data.tag.length != 0) {
                                var nedata;
                                nedata = _.remove(found, function(n) {
                                    var flag = false;
                                    _.each(data.tag, function(n1) {
                                        if (n1.name == n.name) {
                                            flag = true;
                                        }
                                    })
                                    return flag;
                                });
                            }
                            _.each(found, function(m) {
                                returns.push(m);
                            });
                            callback2(exit, exitup, returns);
                        } else {
                            exit++;
                            callback2(exit, exitup, returns);
                        }
                    });
                }
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
                db.collection("tag").find({
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
            var ctag = db.collection('tag').remove({
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
    },
    gettag: function(data, callback) {
        if (data.type && data.type != "" && data.search && data.search != "") {
            var spacedata = data.search;
            spacedata = "\\s" + spacedata;
            var check = new RegExp(spacedata, "i");
            data.search = "^" + data.search;
            var checkname = new RegExp(data.search, "i");
            var matchobj = {
                $or: [{
                    name: {
                        '$regex': checkname
                    }
                }, {
                    name: {
                        '$regex': check
                    }
                }],
                $or: [{
                    category: data.type
                }, {
                    category: {
                        $exists: false
                    }
                }]
            };
        } else if ((!data.type || data.type && data.type == "") && data.search && data.search != "") {
            var spacedata = data.search;
            spacedata = "\\s" + spacedata;
            var check = new RegExp(spacedata, "i");
            data.search = "^" + data.search;
            var checkname = new RegExp(data.search, "i");
            var matchobj = {
                $or: [{
                    name: {
                        '$regex': checkname
                    }
                }, {
                    name: {
                        '$regex': check
                    }
                }],
                category: {
                    $exists: false
                }
            };
        } else if (data.type && data.type != "" && (!data.search || data.search && data.search == "")) {
            var matchobj = {
                $or: [{
                    category: data.type
                }, {
                    category: {
                        $exists: false
                    }
                }]
            };
        } else if (!data.type && !data.search) {
            var matchobj = {};
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("tag").find(matchobj).sort({
                    name: 1
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
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
    }
};
