/**
 * ArtMediumController
 *
 * @description :: Server-side logic for managing ArtMedium
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    artmedium();
                } else {
                    res.json({
                        value: "false",
                        comment: "ArtMedium-id is incorrect"
                    });
                }
            } else {
                artmedium();
            }

            function artmedium() {
                var print = function(data) {
                    res.json(data);
                }
                ArtMedium.save(req.body, print);
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
        ArtMedium.find(req.body, print);
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                ArtMedium.findlimited(req.body, callback);
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
                ArtMedium.findone(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "ArtMedium-id is incorrect"
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
                ArtMedium.delete(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "ArtMedium-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    savemediumexcel: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        ArtMedium.savemediumexcel(req.body, print);
    }
};
