/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body.id = req.session.passport.user.id;
                var userid = {
                    _id: req.body.id
                };
                if (req.body._id) {
                    if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                        cart();
                    } else {
                        res.json({
                            value: false,
                            comment: "Cart-id is incorrect"
                        });
                    }
                } else {
                    cart();
                }
            } else {
                if (req.session.cart && req.session.cart.items && req.session.cart.items.length > 0) {
                    var findindex = sails._.findIndex(req.session.cart.items, {
                        "artwork": req.body.artwork
                    });
                    if (findindex == -1) {
                        req.session.cart.items.push({
                            artwork: req.body.artwork
                        });
                        res.json({
                            value: true
                        });
                    } else {
                        res.json({
                            value: false
                        });
                    }
                } else {
                    req.session.cart = {};
                    req.session.cart.items = [];
                    req.session.cart.items.push({
                        artwork: req.body.artwork
                    });
                    res.json({
                        value: true
                    });
                }
            }

            function cart() {
                var print = function(data) {
                    if (data.value != false) {
                        User.findone(userid, function(userRespo) {
                            if (userRespo.value != false) {
                                userRespo.id = userRespo._id;
                                delete userRespo._id;
                                req.session.passport = {
                                    user: userRespo
                                };
                                res.json(data);
                            } else {
                                res.json({
                                    value: false,
                                    comment: "No data found"
                                });
                            }
                        });
                    } else {
                        res.json(data);
                    }
                }
                Cart.save(req.body, print);
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
            if (req.session.passport) {
                req.body.id = req.session.passport.user.id;
                var userid = {
                    _id: req.body.id
                };
                if (req.body.artwork && req.body.artwork != "" && sails.ObjectID.isValid(req.body.artwork)) {
                    var print = function(data) {
                        if (data.value != false) {
                            User.findone(userid, function(userRespo) {
                                if (userRespo.value != false) {
                                    userRespo.id = userRespo._id;
                                    delete userRespo._id;
                                    req.session.passport = {
                                        user: userRespo
                                    };
                                    res.json(data);
                                } else {
                                    res.json({
                                        value: false,
                                        comment: "No data found"
                                    });
                                }
                            });
                        } else {
                            res.json(data);
                        }
                    }
                    Cart.delete(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Artwork-id is incorrect"
                    });
                }
            } else {
                if (req.session.cart && req.session.cart.items && req.session.cart.items.length > 0) {
                    var findindex = sails._.findIndex(req.session.cart.items, {
                        "artwork": req.body.artwork
                    });
                    if (findindex != -1) {
                        req.session.cart.items.splice(findindex, 1);
                        res.json({
                            value: true
                        });
                    }
                }
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        var i = 0;
        var returnData = [];
        if (req.body) {
            if (req.session.passport) {
                req.body.id = req.session.passport.user.id;

                function callback(data) {
                    res.json(data);
                };
                Cart.find(req.body, callback);
            } else {
                if (req.session.cart && req.session.cart.items && req.session.cart.items.length > 0) {
                    _.each(req.session.cart.items, function(art) {
                        Artwork.findbyid({
                            _id: art.artwork
                        }, function(respo) {
                            if (respo.value != false) {
                                i++;
                                returnData.push(respo[0]);
                                if (i == req.session.cart.items.length) {
                                    res.json(returnData);
                                }
                            } else {
                                i++;
                            }
                        });
                    });
                } else {
                    res.json([]);
                }
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
                    Cart.findone(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Cart-id is incorrect"
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
                    Cart.findlimited(req.body, callback);
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
    }
};
