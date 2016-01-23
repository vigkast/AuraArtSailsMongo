/**
 * WishlistfolderController
 *
 * @description :: Server-side logic for managing Wishlistfolder
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id) {
                    if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                        feed();
                    } else {
                        res.json({
                            value: false,
                            comment: "Wishlistfolder-id is incorrect"
                        });
                    }
                } else {
                    feed();
                }
            } else {
                res.json({
                    value: false,
                    comment: "user-id is incorrect "
                });
            }

            function feed() {
                var print = function(data) {
                    res.json(data);
                }
                Wishlistfolder.save(req.body, print);
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
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Wishlistfolder.delete(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Wishlistfolder-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "user-id is incorrect "
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
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                function callback(data) {
                    res.json(data);
                };
                Wishlistfolder.find(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "user-id is incorrect "
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
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Wishlistfolder.findone(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Wishlistfolder-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "user-id is incorrect "
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
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Wishlistfolder.findlimited(req.body, callback);
                } else {
                    res.json({
                        value: false,
                        comment: "Please provide parameters"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "user-id is incorrect "
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    accessfolder: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user) && req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                if (req.body.password && req.body.password != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Wishlistfolder.accessfolder(req.body, callback);
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
    }
};
