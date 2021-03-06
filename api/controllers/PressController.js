/**
 * PressController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    event();
                } else {
                    res.json({
                        value: false,
                        comment: "Press-id is incorrect"
                    });
                }
            } else {
                event();
            }

            function event() {
                var print = function(data) {
                    res.json(data);
                }
                Press.save(req.body, print);
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
                Press.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Press-id is incorrect"
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
        Press.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Press.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Press-id is incorrect"
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
                Press.findlimited(req.body, callback);
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
    changeExt: function(req, res) {
        var k = 0;
        Press.find(req.body, function(everespo) {
            _.each(everespo, function(z) {
                if (z.photos && z.photos != "") {
                    if (z.photos.indexOf(".") == -1) {
                        z.photos = z.photos.split("jpg").join(".jpg");
                        dbcall();
                    } else {
                        var invite = z.photos.split(".");
                        z.photos = invite[0] + "." + invite[1].toLowerCase();
                        dbcall();
                    }
                } else {
                    k++;
                    if (k == everespo.length) {
                        res.json({
                            value: true,
                            comment: "Extension saved"
                        });
                    }
                }

                function dbcall() {
                    z._id = sails.ObjectID(z._id);
                    Press.save(z, function(respo) {
                        k++;
                        if (k == everespo.length) {
                            res.json({
                                value: true,
                                comment: "Extension saved"
                            });
                        }
                    });
                }
            });
        });
    }
};
