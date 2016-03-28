/**
 * Reachout.js
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
                    db.collection('reachout').insert(data, function(err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (created) {
                            var obj = {
                                "api_key": "47e02d2b10604fc81304a5837577e286",
                                "email_details": {
                                    "fromname": sails.fromName,
                                    "subject": "Query to Aura-Art Admin",
                                    "from": sails.fromEmail,
                                    "replytoid": sails.fromEmail
                                },
                                "settings": {
                                    "template": "2599"
                                },
                                "recipients": ["connect@auraart.in"],
                                "attributes": {
                                    "FROM": [data.person],
                                    "EMAIL": [data.from],
                                    "MOB": [data.number],
                                    "REM": [data.remarks]
                                }
                            };
                            sails.request.get({
                                url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                            }, function(err, httpResponse, body) {
                                if (err) {
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (body && body == "success") {
                                    callback({
                                        value: true,
                                        comment: "Mail sent"
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: false,
                                        comment: "Error"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                } else {
                    var reachout = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('reachout').update({
                        _id: reachout
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
                                comment: "Data updated"
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
                db.collection("reachout").count({
                    person: {
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
                    db.collection("reachout").find({
                        person: {
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
        var returns = [];
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("reachout").find({}, {}).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
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
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("reachout").find({
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
            db.collection('reachout').remove({
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
