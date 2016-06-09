/**
 * TicketController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                if (req.session.passport.user.accesslevel && req.session.passport.user.accesslevel == "customer") {
                    req.body.client = [];
                    req.body.client.push({
                        _id: req.session.passport.user.id,
                        name: req.session.passport.user.name
                    });
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticket.save(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Only customers can create projects"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    edit: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticket.edit(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Ticket-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    saveBack: function(req, res) {
        if (req.body) {
            if (req.body.client && req.body.client.length > 0 && req.body.artist && req.body.artist.length > 0) {
                if (req.body._id) {
                    if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                        user();
                    } else {
                        res.json({
                            value: false,
                            comment: "Ticket-id is incorrect"
                        });
                    }
                } else {
                    user();
                }

                function user() {
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticket.saveBack(req.body, print);
                }
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Ticket.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect"
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
        Ticket.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                if (req.session.passport) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticket.findone(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "User not logged-in"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findTicketBack: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Ticket.findTicketBack(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findoneBack: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Ticket.findoneBack(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect"
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
                Ticket.findlimited(req.body, callback);
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
    getProject: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body._id = req.session.passport.user.id;
                req.body.accesslevel = req.session.passport.user.accesslevel;
                Ticket.getProject(req.body, function(respo) {
                    res.json(respo);
                });
            } else {
                res.json({
                    value: false,
                    comment: "User not logged-in"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide params"
            });
        }
    }
};
