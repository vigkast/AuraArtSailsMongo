/**
 * ShotController
 *
 * @description :: Server-side logic for managing Shots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var shotUrl = "http://www.auraart.in/#/room-shot/";
// var shotUrl = "http://192.168.1.122/Auraartsailsmongo/assets/#/room-shot/";
module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    shot();
                } else {
                    res.json({
                        value: false,
                        comment: "Shot-id is incorrect"
                    });
                }
            } else {
                shot();
            }

            function shot() {
                var print = function(data) {
                    res.json(data);
                }
                Shot.save(req.body, print);
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
                Shot.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Shot-id is incorrect"
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
        Shot.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Shot.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Shot-id is incorrect"
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
                Shot.findlimited(req.body, callback);
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
    createImage: function(req, res) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 12; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        var imageName = text + ".jpg";
        var path = "./profileUploads/" + imageName;
        if (req.body && req.body.url && req.body.url != "") {
            sails.webshot(shotUrl + req.body.url, path, { siteType: "url", renderDelay: 5000, windowSize: { width: 665, height: 500 } }, function(err) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        comment: err
                    });
                } else {
                    res.json({
                        value: true,
                        comment: imageName
                    });
                    setTimeout(function() {
                        sails.fs.unlink(path, function() {});
                    }, 120000);
                }
            });
        } else {
            res.json({
                value: false,
                comment: "Please provide params"
            });
        }
    },
    saveToProfile: function(req, res) {
        if (req.session.passport) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 12; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            var imageName = text + ".jpg";
            var path = "./profileUploads/" + imageName;
            sails.webshot(shotUrl + req.body.url, path, { siteType: "url", renderDelay: 5000, windowSize: { width: 665, height: 500 } }, function(err) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        comment: err
                    });
                } else {
                    req.body.imageName = imageName;
                    req.body._id = req.session.passport.user.id;
                    User.viewInMyRoomPic(req.body, function(respoView) {
                        if (respoView.value == true) {
                            req.body._id = req.session.passport.user.id;
                            User.findone(req.body, function(oneRespo) {
                                if (!oneRespo.value) {
                                    oneRespo.id = oneRespo._id;
                                    delete oneRespo._id;
                                    req.session.passport = {
                                        user: oneRespo
                                    };
                                    res.json({
                                        value: true,
                                        comment: imageName
                                    });
                                } else {
                                    res.json({
                                        value: false,
                                        comment: "User not found"
                                    });
                                }
                            });
                        } else {
                            res.json({
                                value: false,
                                comment: "Some Error"
                            });
                        }
                    });
                }
            });
        } else {
            res.json({
                value: false,
                comment: "User not logged-in"
            });
        }
    },
};
