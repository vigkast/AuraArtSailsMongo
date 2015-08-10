/**
 * HtmlpageController
 *
 * @description :: Server-side logic for managing Htmlpage
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Htmlpage.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Htmlpage.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Htmlpage.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Htmlpage.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Htmlpage.delete(req.body, print);
    },
    counthtmlpage: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Htmlpage.counthtmlpage(req.body, print);
    }
};