/**
 * EnquiryController
 *
 * @description :: Server-side logic for managing Enquiry
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Enquiry.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Enquiry.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Enquiry.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Enquiry.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Enquiry.delete(req.body, print);
    },
    countenquiry: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Enquiry.countenquiry(req.body, print);
    }
};