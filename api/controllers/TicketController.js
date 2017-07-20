/**
 * TicketController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body.client = [];
                req.body.client.push({
                    _id: req.session.passport.user.id,
                    name: req.session.passport.user.name,
                    email: req.session.passport.user.email
                });
                var print = function (data) {
                    res.json(data);
                }
                Ticket.save(req.body, print);
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
    edit: function (req, res) {
        if (req.body) {
            if (req.session.passport) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function (data) {
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
    saveBack: function (req, res) {
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
                    var print = function (data) {
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
    delete: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
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
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticket.find(req.body, callback);
    },
    findone: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                if (req.session.passport) {
                    var print = function (data) {
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
    findTicketBack: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
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
    findoneBack: function (req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function (data) {
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
    findlimited: function (req, res) {
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
    getProject: function (req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body._id = req.session.passport.user.id;
                Ticket.getProject(req.body, function (respo) {
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
    },
    sendEmail: function (req, res) {
        console.log("in send email demo");
        var obj = {
            "api_key": "47e02d2b10604fc81304a5837577e286",
            "email_details": {
                "fromname": "jagruti",
                "subject": "Registration at www.auraart.in",
                "from": "rishiraj@auraart.in",
                "replytoid": "jagruti@wohlig.com",
            },
            "settings": {
                "template": "2336",
            },
            "recipients": ["jagruti@wohlig.com", "sohan@wohlig.com"],
            "attributes": {
                "NAME": ["jagruti"],
                "EMAIL": ["jagruti@wohlig.com"]
            }
        };

        sails.request.get({
            url: "https://api.falconide.com/falconapi/web.send.json?data=" + JSON.stringify(obj)
        }, function (err, httpResponse, body) {
            console.log(httpResponse);
            console.log("ooooooooooooooo");
            console.log(JSON.parse(body));
            var a = JSON.parse(body);
            console.log(a.message);
            if (err) {
                res.json({
                    value: false,
                    comment: "Please provide params"
                });
            } else if (body && (body == "success")) {
                data.id = created.ops[0]._id;
                delete data.accessToken;
                delete data.token;
                delete data.tokenSecret;
                res.json({
                    value: data,
                    comment: "Please provide params"
                });
            } else {
                res.json({
                    value: false,
                    comment: "Error"
                });
            }
        });
    }
};
