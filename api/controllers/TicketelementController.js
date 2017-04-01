/**
 * TicketelementController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                if (req.body.ticket && req.body.ticket != "" && sails.ObjectID.isValid(req.body.ticket) && req.body.status && req.body.status != "") {
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticketelement.save(req.body, print);
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
            if (req.body.ticket && req.body.ticket != "" && sails.ObjectID.isValid(req.body.ticket)) {
                var print = function(data) {
                    res.json(data);
                }
                Ticketelement.save(req.body, print);
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body.ticket && req.body.ticket != "" && sails.ObjectID.isValid(req.body.ticket)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticketelement.delete(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Ticketelement-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect "
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
        if (req.body) {
            if (req.body.ticket && req.body.ticket != "" && sails.ObjectID.isValid(req.body.ticket)) {
                function callback(data) {
                    res.json(data);
                };
                Ticketelement.find(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect "
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body.ticket && req.body.ticket != "" && sails.ObjectID.isValid(req.body.ticket)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Ticketelement.findone(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Ticketelement-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect "
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
            if (req.body.ticket && req.body.ticket != "" && sails.ObjectID.isValid(req.body.ticket)) {
                if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Ticketelement.findlimited(req.body, callback);
                } else {
                    res.json({
                        value: false,
                        comment: "Please provide parameters"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "Ticket-id is incorrect "
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
