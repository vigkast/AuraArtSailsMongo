/**
 * OrderController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var frontend = "http://www.auraart.in/#";
//var frontend = "http://www.auraart.in/manjhi/#";
module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body._id = req.session.passport.user.id;
                save();
            } else {
                Order.saveGuest(req.body, function(orderRespo) {
                    if (orderRespo.value != false) {
                        req.session.cart = {};
                        res.json(orderRespo);
                    } else {
                        res.json(orderRespo);
                    }
                });
            }

            function save() {
                User.findone(req.body, function(respo) {
                    respo.user = respo._id;
                    var userid = {
                        _id: respo._id
                    };
                    respo.packing = req.body.packing;
                    respo.vat = req.body.vat;
                    respo.grantTotal = req.body.grantTotal;
                    respo.subTotal = req.body.subTotal;
                    respo.billing = req.body.billing;
                    respo.shipping = req.body.shipping;
                    respo.comment = req.body.comment;
                    respo.cart = req.body.cart;
                    delete respo._id;
                    Order.save(respo, function(data2) {
                        if (data2.value != false) {
                            User.findone(userid, function(userRespo) {
                                if (userRespo.value != false) {
                                    userRespo.id = userRespo._id;
                                    delete userRespo._id;
                                    req.session.passport = {
                                        user: userRespo
                                    };
                                    res.json(data2);
                                } else {
                                    res.json({
                                        value: false,
                                        comment: "No data found"
                                    });
                                }
                            });
                        } else {
                            res.json(data2);
                        }
                    });
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
                Order.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Order-id is incorrect"
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
        var print = function(data) {
            res.json(data);
        }
        Order.find(req.body, print);
    },
    findOrders: function(req, res) {
        if (req.session.passport) {
            req.body.user = req.session.passport.user.id;
            var print = function(data) {
                res.json(data);
            }
            Order.findOrders(req.body, print);
        } else {
            res.json([]);
        }
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Order.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Slider-id is incorrect"
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
                Order.findlimited(req.body, callback);
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
    editOrder: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Order.editOrder(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Order-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    payU: function(req, res) {
        if (req.body) {
            Order.payU(req.body, function(respo) {
                 console.log(respo);
                if (respo.value != false) {
                    res.redirect(frontend + "/thankyou");
                } else {
                    res.redirect(frontend + "/sorry/" + respo.orderid);
                }
            });
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    deleteall: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false
                });
            }
            db.collection('order').remove({}, function(err, deleted) {
                if (deleted) {
                    res.json({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    res.json({
                        value: false
                    });
                    db.close();
                } else {
                    res.json({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
};
