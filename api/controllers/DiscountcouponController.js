/**
 * DiscountcouponController
 *
 * @description :: Server-side logic for managing Discountcoupon
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Discountcoupon.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Discountcoupon.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Discountcoupon.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Discountcoupon.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Discountcoupon.delete(req.body, print);
    },
    countdiscountcoupon: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Discountcoupon.countdiscountcoupon(req.body, print);
    }
};