/**
 * BackUserController
 *
 * @description :: Server-side logic for managing BackUsers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    back();
                } else {
                    res.json({
                        value: false,
                        comment: "BackUser-id is incorrect"
                    });
                }
            } else {
                back();
            }

            function back() {
                var print = function(data) {
                    res.json(data);
                }
                BackUser.save(req.body, print);
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
                BackUser.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "BackUser-id is incorrect"
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
        function callback(data) {
            res.json(data);
        };
        BackUser.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                BackUser.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "BackUser-id is incorrect"
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
                BackUser.findlimited(req.body, callback);
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
