/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    event();
                } else {
                    res.json({
                        value: false,
                        comment: "Event-id is incorrect"
                    });
                }
            } else {
                event();
            }

            function event() {
                var print = function(data) {
                    res.json(data);
                }
                Event.save(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Event.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Event-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Event.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Event-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Event.findlimited(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findevents: function(req, res) {
        if (req.body) {
            function callback(data) {
                res.json(data);
            };
            Event.findevents(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    changeExt: function(req, res) {
        var k = 0;
        Event.find(req.body, function(everespo) {
            _.each(everespo, function(z) {
                var i = 0;
                if (z.invitation && z.invitation != "") {
                    var invite = z.invitation.split(".");
                    z.invitation = invite[0] + "." + invite[1].toLowerCase();
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.catalogue && z.catalogue != "") {
                    var cata = z.catalogue.split(".");
                    z.catalogue = cata[0] + "." + cata[1].toLowerCase();
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.exhibitor && z.exhibitor != "") {
                    var exhi = z.exhibitor.split(".");
                    z.exhibitor = exhi[0] + "." + exhi[1].toLowerCase();
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.stall && z.stall != "") {
                    var stall = z.stall.split(".");
                    z.stall = stall[0] + "." + stall[1].toLowerCase();
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.photos && z.photos.length > 0) {
                    var j = 0;
                    var pics = [];
                    _.each(z.photos, function(y) {
                        var phot = y.split(".");
                        y = phot[0] + "." + phot[1].toLowerCase();
                        pics.push(y);
                        j++;
                        if (j == z.photos.length) {
                            z.photos = pics;
                            firstcall();
                        }
                    });

                    function firstcall() {
                        i++;
                        if (i == 5) {
                            dbcall();
                        }
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }

                function dbcall() {
                    z._id = sails.ObjectID(z._id);
                    Event.save(z, function(respo) {
                        k++;
                        if (k == everespo.length) {
                            res.json({
                                value: true,
                                comment: "Extension saved"
                            });
                        }
                    });
                }
            });
        });
    },
    changesome: function(req, res) {
        var k = 0;
        Event.find(req.body, function(everespo) {
            _.each(everespo, function(z) {
                var i = 0;
                if (z.invitation && z.invitation != "") {
                    if (z.invitation.indexOf(".jpg") == -1) {
                        z.invitation = z.invitation.split("jpg").join(".jpg");
                    }
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.catalogue && z.catalogue != "") {
                    if (z.catalogue.indexOf(".jpg") == -1) {
                        z.catalogue = z.catalogue.split("jpg").join(".jpg");
                    }
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.exhibitor && z.exhibitor != "") {
                    if (z.exhibitor.indexOf(".jpg") == -1) {
                        z.exhibitor = z.exhibitor.split("jpg").join(".jpg");
                    }
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.stall && z.stall != "") {
                    if (z.stall.indexOf(".jpg") == -1) {
                        z.stall = z.stall.split("jpg").join(".jpg");
                    }
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }
                if (z.photos && z.photos.length > 0) {
                    var j = 0;
                    var pics = [];
                    _.each(z.photos, function(y) {
                        if (y.indexOf(".jpg") == -1) {
                            y = y.split("jpg").join(".jpg");
                        }
                        pics.push(y);
                        j++;
                        if (j == z.photos.length) {
                            z.photos = pics;
                            firstcall();
                        }
                    });

                    function firstcall() {
                        i++;
                        if (i == 5) {
                            dbcall();
                        }
                    }
                } else {
                    i++;
                    if (i == 5) {
                        dbcall();
                    }
                }

                function dbcall() {
                    z._id = sails.ObjectID(z._id);
                    Event.save(z, function(respo) {
                        k++;
                        if (k == everespo.length) {
                            res.json({
                                value: true,
                                comment: "Extension saved"
                            });
                        }
                    });
                }
            });
        });

    }
};
