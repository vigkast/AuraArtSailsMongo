/**
 * ArtMedium.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function (data, callback) {
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function (err, db) {
                var exit = 0;
                var exitup = 0;
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    
                }
                if (db) {
                    exit++;
                    db.collection("artmedium").find({
                        "name": data.name
                    }).each(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            
                        }
                        if (data2 != null) {
                            exitup++;
                            callback(data2);
                            
                        } else {
                            if (exit != exitup) {
                                var cartmedium = db.collection('artmedium').insert(data, function (err, created) {
                                    if (err) {
                                        console.log(err);
                                        callback({
                                            value: false
                                        });
                                        
                                    }
                                    if (created) {
                                        callback({
                                            value: true,
                                            id: data._id
                                        });
                                        
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else {
            sails.query(function (err, db) {
                var artmedium = sails.ObjectID(data._id);
                delete data._id
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    
                }
                if (db) {
                    var cartmedium = db.collection('artmedium').update({
                        _id: artmedium
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
        if (data.category != "") {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    
                }
                if (db) {
                    db.collection("artmedium").count({
                        name: {
                            '$regex': check
                        },
                        category: data.category
                    }, function (err, number) {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        newcallback++;
                        if (newcallback == 2) {
                            callback(newreturns);
                            
                        }
                    });
                    db.collection("artmedium").find({
                        name: {
                            '$regex': check
                        },
                        category: data.category
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            
                            console.log(err);
                        }
                        if (found != null) {
                            newreturns.data.push(found);
                        } else {
                            if (found == null) {
                                newcallback++;
                                if (newcallback == 2) {
                                    callback(newreturns);
                                    
                                }
                            }
                        }
                    });
                }
            });
        } else {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    
                }
                if (db) {
                    db.collection("artmedium").count({
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
                    db.collection("artmedium").find({
                        name: {
                            '$regex': check
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            
                            console.log(err);
                        }
                        if (found != null) {
                            newreturns.data.push(found);
                        } else {
                            if (found == null) {
                                newcallback++;
                                if (newcallback == 2) {
                                    callback(newreturns);
                                    
                                }
                            }
                        }
                    });
                }
            });
        }
    },
    find: function (data, callback) {
        var returns = [];
        var exit = 0;
        var exitup = 1;
        var check = new RegExp(data.search, "i");

        function callback2(exit, exitup, data) {
            if (exit == exitup) {
                callback(data);
            }
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
                
            }
            if (db) {
                db.collection("artmedium").find({
                    name: {
                        '$regex': check
                    },
                    category: data.category
                }).limit(10).toArray(function (err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        
                        console.log(err);
                    }
                    if (found != null) {
                        exit++;
                        if (data.artmedium.length != 0) {
                            var nedata;
                            nedata = _.remove(found, function (n) {
                                var flag = false;
                                _.each(data.artmedium, function (n1) {
                                    if (n1.name == n.name) {
                                        flag = true;
                                    }
                                })
                                return flag;
                            });
                        }
                        returns = returns.concat(found);
                        callback2(exit, exitup, returns);
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
                db.collection("artmedium").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        
                    }
                    if (data != null) {
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
            var cartmedium = db.collection('artmedium').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
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
    savemediumexcel: function (data, callback) {
        var newdata = {};
        newdata.name = data.mediumname;
        newdata._id = sails.ObjectID();
        newdata.category = data.type;
        sails.query(function (err, db) {
            var exit = 0;
            var exitup = 0;
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
                
            }
            if (db) {
                exit++;
                db.collection("artmedium").find({
                    "name": data.mediumname
                }).each(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        
                    }
                    if (data2 != null) {
                        exitup++;
                        callback(data2._id);
                        
                    } else {
                        if (exit != exitup) {
                            db.collection('artmedium').insert(newdata, function (err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    
                                }
                                if (created) {
                                    callback(newdata._id);
                                    
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};