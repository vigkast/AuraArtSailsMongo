/**
 * DiscountcouponController
 *
 * @description :: Server-side logic for managing Discountcoupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    dc();
                } else {
                    res.json({
                        value: false,
                        comment: "Discountcoupon-id is incorrect"
                    });
                }
            } else {
                dc();
            }

            function dc() {
                var print = function(data) {
                    res.json(data);
                }
                Discountcoupon.save(req.body, print);
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
        Discountcoupon.find(req.body, print);
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Discountcoupon.findlimited(req.body, callback);
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
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Discountcoupon.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Discountcoupon-id is incorrect"
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
                Discountcoupon.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Discountcoupon-id is incorrect"
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
