/**
 * Ticket.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function (data, callback) {
        data.timestamp = new Date();
        data.status = "Scoping";
        _.each(data.client, function (client) {
            client._id = sails.ObjectID(client._id);
        });
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else {
                data._id = sails.ObjectID();
                data.ticketnumber = 1;

                function callSave() {
                    db.collection('ticket').insert(data, function (err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (created) {
                            console.log("demo demo demo", created);
                            // To Client
                            var dat = created.ops[0];
                            var mtrls = "";
                            var imgstng = "";
                            _.each(dat.medium, function (mt, key) {
                                if (key == dat.medium.count - 1) {
                                    mtrls += mt.name
                                } else {
                                    mtrls += mt.name + " / "
                                }
                            });
                            _.each(dat.image, function (mt, key) {
                                imgstng += "<img src='" + sails.myurl + "user/resize?height=200&file=" + mt + "'>"
                            });
                            var obj = {
                                "api_key": "47e02d2b10604fc81304a5837577e286",
                                "email_details": {
                                    "fromname": encodeURIComponent("Aura - Art"),
                                    "subject": "",
                                    "from": "cs@auraart.in",
                                    "replytoid": "cs@auraart.in"
                                },
                                "settings": {
                                    "template": "5589"
                                },
                                "recipients": [dat.client[0].email, "sohan@wohlig.com"],
                                "attributes": {
                                    "WHO": [dat.client[0].name, "Admin"],
                                    "CONTENTBODY": [encodeURIComponent("Your Ticket Number: " + dat.ticketnumber), encodeURIComponent("You have a new request for proposal for Commissioned Artwork with Ticket Number: " + dat.ticketnumber + ".Please go through the requirements below and respond promptly with the proposal.")],
                                    "MATERIAL": [encodeURIComponent(mtrls), encodeURIComponent(mtrls)],
                                    "TITLE": [encodeURIComponent(dat.title), encodeURIComponent(dat.title)],
                                    "BRIEF": [encodeURIComponent(dat.brief), encodeURIComponent(dat.brief)],
                                    "SIZE": [encodeURIComponent(dat.height + "x" + dat.width + "x" + dat.depth), encodeURIComponent(dat.height + "x" + dat.width + "x" + dat.depth)],
                                    "BUDGET": [encodeURIComponent("From" + dat.currency + dat.startPrice + " To " + dat.endPrice), encodeURIComponent("From" + dat.currency + dat.startPrice + " To " + dat.endPrice)],
                                    "ADDITIONALINFO": [encodeURIComponent(dat.additionalInfo), encodeURIComponent(dat.additionalInfo)],
                                    "TIME": [encodeURIComponent(dat.leadTime), encodeURIComponent(dat.leadTime)],
                                    "LOCATION": [encodeURIComponent(dat.deliveryLocation), encodeURIComponent(dat.deliveryLocation)],
                                    "REFERENCES": [encodeURIComponent(imgstng), encodeURIComponent(imgstng)]


                                }
                            };
                            obj.email_details.subject = encodeURIComponent("Aura Art - Commissioned Artwork - " + dat.ticketnumber + " " + dat.title);
                            console.log(obj);
                            sails.request.get({
                                url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                            }, function (err, httpResponse, body) {
                                console.log(err);
                                console.log(body);
                                var body = JSON.parse(body);
                                if (err) {
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (body && (body.message == "SUCCESS")) {
                                    data.id = created.ops[0]._id;
                                    delete data.accessToken;
                                    delete data.token;
                                    delete data.tokenSecret;
                                    callback(data);
                                    db.close();
                                } else {
                                    callback({
                                        value: false,
                                        comment: "Error"
                                    });
                                    db.close();
                                }
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
                db.collection('ticket').find({ ticketnumber: { $exists: true } }, { ticketnumber: 1 }).sort({ ticketnumber: -1 }).limit(1).toArray(function (err, foundTicket) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    } else if (foundTicket && foundTicket.length > 0) {
                        data.ticketnumber = foundTicket[0].ticketnumber + 1;
                        callSave();
                    } else {
                        data.ticketnumber = 1;
                        callSave();
                    }
                });
            }
        });
    },
    edit: function (data, callback) {
        delete data.timestamp;
        delete data.client;
        delete data.artist;
        var ticket = sails.ObjectID(data._id);
        delete data._id;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else {
                db.collection('ticket').update({
                    _id: ticket
                }, {
                        $set: data
                    }, function (err, updated) {
                        console.log("updated in ticket", updated.result);
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            // EMAIL GOES HERE
                            // IF CLOSED EMAIL GOES HERE
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
        });
    },
    saveBack: function (data, callback) {
        _.each(data.client, function (client) {
            client._id = sails.ObjectID(client._id);
        });
        _.each(data.artist, function (client) {
            client._id = sails.ObjectID(client._id);
        });
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection('ticket').insert(data, function (err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (created) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Not Created"
                            });
                            db.close();
                        }
                    });
                } else {
                    console.log("in edit section");
                    var ticket = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('ticket').update({
                        _id: ticket
                    }, {
                            $set: data
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                                console.log("demonstration", data.artist[0]);


                                console.log("demo demo demo", data);
                                // To Client
                                if (data.artist.count != 0) {
                                    var dat = data;
                                    var mtrls = "";
                                    _.each(dat.medium, function (mt, key) {
                                        if (key == dat.medium.count - 1) {
                                            mtrls += mt.name
                                        } else {
                                            mtrls += mt.name + " / "
                                        }

                                    });
                                    if (data.status == "Closing") {

                                        var obj = {
                                            "api_key": "47e02d2b10604fc81304a5837577e286",
                                            "email_details": {
                                                "fromname": encodeURIComponent("Aura - Art"),
                                                "subject": "",
                                                "from": "cs@auraart.in",
                                                "replytoid": "cs@auraart.in"
                                            },
                                            "settings": {
                                                "template": "5589"
                                            },
                                            "recipients": [dat.artist[0].email, dat.client[0].email, "sohan@wohlig.com"],
                                            "attributes": {
                                                "WHO": [dat.artist[0].name, dat.client[0].name, "Admin"],
                                                "CONTENTBODY": [encodeURIComponent("Ticket - " + dat.ticketnumber + dat.title + " - has been Closed."), encodeURIComponent("Ticket - " + dat.ticketnumber + dat.title + " - has been Closed."), encodeURIComponent("Ticket - " + dat.ticketnumber + dat.title + " - has been Closed.")],
                                                "MATERIAL": [encodeURIComponent((mtrls == "") ? "-" : mtrls), encodeURIComponent((mtrls == "") ? "-" : mtrls), encodeURIComponent((mtrls == "") ? "-" : mtrls)],
                                                "TITLE": [encodeURIComponent(dat.title), encodeURIComponent(dat.title), encodeURIComponent(dat.title)],
                                                "BRIEF": [encodeURIComponent(dat.brief), encodeURIComponent(dat.brief), encodeURIComponent(dat.brief)],
                                                "SIZE": [encodeURIComponent(dat.heightfinal + "x" + dat.widthfinal + "x" + dat.depthfinal +
                                                    " " + dat.majorfinal), encodeURIComponent(dat.heightfinal + "x" + dat.widthfinal + "x" + dat.depthfinal +
                                                        " " + dat.majorfinal), encodeURIComponent(dat.heightfinal + "x" + dat.widthfinal + "x" + dat.depthfinal +
                                                            " " + dat.majorfinal)],
                                                "BUDGET": [encodeURIComponent("-"), encodeURIComponent("-"), encodeURIComponent("-")],
                                                "ADDITIONALINFO": [encodeURIComponent((dat.additionalInfo) ? dat.additionalInfo : "-"), encodeURIComponent((dat.additionalInfo) ? dat.additionalInfo : "-"), encodeURIComponent((dat.additionalInfo) ? dat.additionalInfo : "-")],
                                                "TIME": [encodeURIComponent(dat.deadline), encodeURIComponent(dat.deadline), encodeURIComponent(dat.deadline)],
                                                "LOCATION": [encodeURIComponent(dat.location), encodeURIComponent(dat.location), encodeURIComponent(dat.location)],
                                                "REFERENCES": [encodeURIComponent("<img src='" + sails.myurl + "user/resize?height=200&file=" + dat.imagenew + "'>"), encodeURIComponent("<img src='" + sails.myurl + "user/resize?height=200&file=" + dat.imagenew + "'>")]

                                            }
                                        };
                                        obj.email_details.subject = encodeURIComponent("Aura Art - Commissioned Artwork - Closing" + dat.ticketnumber + " " + dat.title);
                                        console.log(obj);
                                        sails.request.get({
                                            url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                                        }, function (err, httpResponse, body) {
                                            console.log(err);
                                            console.log(body);
                                            var body = JSON.parse(body);
                                            if (err) {
                                                callback({
                                                    value: false
                                                });
                                                db.close();
                                            } else if (body && (body.message == "SUCCESS")) {
                                                callback({
                                                    value: true
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
                                        db.close();

                                    } else {
                                        var imgstng = ""
                                        _.each(dat.image, function (mt, key) {
                                            imgstng += "<img src='" + sails.myurl + "user/resize?height=200&file=" + mt + "'>"
                                        });
                                        var obj = {
                                            "api_key": "47e02d2b10604fc81304a5837577e286",
                                            "email_details": {
                                                "fromname": encodeURIComponent("Aura - Art"),
                                                "subject": "",
                                                "from": "cs@auraart.in",
                                                "replytoid": "cs@auraart.in"
                                            },
                                            "settings": {
                                                "template": "5589"
                                            },
                                            "recipients": [dat.artist[0].email, "sohan@wohlig.com"],
                                            "attributes": {
                                                "WHO": [dat.artist[0].name, "Admin"],
                                                "CONTENTBODY": [encodeURIComponent("We request you to submit your proposal for commissioned Artworks , based on the following requirements:"), encodeURIComponent("AuraArt assigned " + dat.title + "Artwork to " + dat.artist[0].name)],
                                                "MATERIAL": [encodeURIComponent((mtrls == "") ? "-" : mtrls), encodeURIComponent((mtrls == "") ? "-" : mtrls)],
                                                "TITLE": [encodeURIComponent(dat.title), encodeURIComponent(dat.title)],
                                                "BRIEF": [encodeURIComponent(dat.brief), encodeURIComponent(dat.brief)],
                                                "SIZE": [encodeURIComponent(dat.heightfinal + "x" + dat.widthfinal + "x" + dat.depthfinal +
                                                    " " + dat.majorfinal), encodeURIComponent(dat.heightfinal + "x" + dat.widthfinal + "x" + dat.depthfinal +
                                                        " " + dat.majorfinal)],
                                                "BUDGET": [encodeURIComponent("-"), encodeURIComponent("-")],
                                                "ADDITIONALINFO": [encodeURIComponent((dat.additionalInfo) ? dat.additionalInfo : "-"), encodeURIComponent((dat.additionalInfo) ? dat.additionalInfo : "-")],
                                                "TIME": [encodeURIComponent(dat.deadline), encodeURIComponent(dat.deadline)],
                                                "LOCATION": [encodeURIComponent(dat.location), encodeURIComponent(dat.location)],
                                                "REFERENCES": [encodeURIComponent(imgstng), encodeURIComponent(imgstng)]

                                            }
                                        };
                                        obj.email_details.subject = encodeURIComponent("Aura Art - Commissioned Artwork - " + dat.ticketnumber + " " + dat.title);
                                        console.log(obj);
                                        sails.request.get({
                                            url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
                                        }, function (err, httpResponse, body) {
                                            console.log(err);
                                            console.log(body);
                                            var body = JSON.parse(body);
                                            if (err) {
                                                callback({
                                                    value: false
                                                });
                                                db.close();
                                            } else if (body && (body.message == "SUCCESS")) {
                                                callback({
                                                    value: true
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
                                        db.close();
                                    }
                                } else {
                                    callback({
                                        value: true
                                    });
                                    db.close();
                                }

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
                db.collection("ticket").count({
                    title: {
                        '$regex': check
                    }
                }, function (err, number) {
                    if (number) {
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
                        db.close()
                    }
                });

                function callbackfunc() {
                    db.collection("ticket").find({
                        title: {
                            '$regex': check
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found != null) {
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
                db.collection("ticket").find({}, {}).toArray(function (err, found) {
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
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").find({
                    "_id": sails.ObjectID(data._id),
                    ticketelement: {
                        $exists: true
                    }
                }, {
                        _id: 0,
                        ticketelement: 1
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (data2 && data2.length > 0) {
                            callback(data2[0].ticketelement);
                            db.close();
                        } else {
                            callback([]);
                            db.close();
                        }
                    });
            }
        });
    },
    findTicketBack: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").find({
                    "_id": sails.ObjectID(data._id)
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2.length > 0) {
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback([]);
                        db.close();
                    }
                });
            }
        });
    },
    findoneBack: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").find({
                    "_id": sails.ObjectID(data._id)
                }, {
                        ticketelement: 0
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (data2 && data2.length > 0) {
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
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cticket = db.collection('ticket').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
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
    getProject: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: err
                });
            } else {
                db.collection("ticket").find({
                    $or: [{
                        "artist._id": sails.ObjectID(data._id)
                    }, {
                        "client._id": sails.ObjectID(data._id)
                    }]
                }, {
                        ticketelement: 0
                    }).toArray(function (err, found) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: err
                            });
                            db.close();
                        } else if (found && found.length > 0) {
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
    }
};
