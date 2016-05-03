/**
 * SliderController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    user();
                } else {
                    res.json({
                        value: false,
                        comment: "Slider-id is incorrect"
                    });
                }
            } else {
                user();
            }

            function user() {
                var print = function(data) {
                    res.json(data);
                }
                Slider.save(req.body, print);
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
                Slider.delete(req.body, print);
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
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Slider.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Slider.findone(req.body, print);
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
                Slider.findlimited(req.body, callback);
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
        var html = "<html><head><link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css' rel='stylesheet' type='text/css'></head><body>" + req.body.image + "</body></html>";
        // html = html.split("img/").join("http://localhost:82/img/");
        html = html.split("img/").join("http://www.auraart.in/img/");
        // var css = "body {margin:0}.height-holder { height: 500px;   width: 665px; position: relative;   min-height: 100%;   height: 100%;   overflow: hidden;}.wall-builder { height: 500px;   width: 665px;   margin: 0 auto; padding-right: 310px;   width: 100%;}.painting-holder { position: absolute; left: 0; top: 0; height: 100%; width: 100%; height: auto; width: auto; left: 30%; top: 52px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);}.wall-image { position: absolute; left: 0; top: 0; height: 100%; width: 100%; background-repeat: no-repeat; background-position: 50% 50%; background-size: 100% auto;}.dim {  position: absolute;  color: white;  text-shadow: 0 0 4px rgba(0, 0, 0, 0.35);  font-size: 14px;  text-transform: uppercase;}.dim.dim-h {  top: 50%;  left: -20px;}.dim.dim-w {  top: -20px;  left: 0px;  width: 100%;  text-align: center;}.furniture-holder {position:absolute}";
        var options = {
            windowSize: {
                width: 665,
                height: 500
            },
            quality: 500,
            siteType: "html",
            customCSS: sails.css
        };
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 12; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        var imageName = text + ".jpg";
        var path = "./profileUploads/" + imageName;
        sails.webshot(html, path, options, function(err) {
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
    },
    saveToProfile: function(req, res) {
        if (req.session.passport) {
            var html = req.body.image;
            // html = html.split("img/").join("http://localhost:82/img/");
            html = html.split("img/").join("http://www.auraart.in/img/");
            // var css = "body {margin:0}.height-holder { height: 500px;   width: 665px; position: relative;   min-height: 100%;   height: 100%;   overflow: hidden;}.wall-builder { height: 500px;   width: 665px;   margin: 0 auto; padding-right: 310px;   width: 100%;}.painting-holder { position: absolute; left: 0; top: 0; height: 100%; width: 100%; height: auto; width: auto; left: 30%; top: 52px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);}.wall-image { position: absolute; left: 0; top: 0; height: 100%; width: 100%; background-repeat: no-repeat; background-position: 50% 50%; background-size: 100% auto;}.dim {  position: absolute;  color: white;  text-shadow: 0 0 4px rgba(0, 0, 0, 0.35);  font-size: 14px;  text-transform: uppercase;}.dim.dim-h {  top: 50%;  left: -20px;}.dim.dim-w {  top: -20px;  left: 0px;  width: 100%;  text-align: center;}.furniture-holder {position:absolute}";
            var options = {
                windowSize: {
                    width: 665,
                    height: 500
                },
                quality: 500,
                siteType: "html",
                customCSS: sails.css
            };
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 12; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            var imageName = text + ".jpg";
            var path = "./profileUploads/" + imageName;
            sails.webshot(html, path, options, function(err) {
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
    downloadImage: function(req, res) {
        var filename = req.query.file;
        var isfile = sails.fs.existsSync('./profileUploads/' + filename);
        if (isfile) {
            var path = "./profileUploads/" + filename;
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', "application/octet-stream");
            res.set('Content-Disposition', "attachment;filename=" + path);
            res.send(image);
        } else {
            var path = "./profileUploads/noimage.jpg";
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', "application/octet-stream");
            res.set('Content-Disposition', "attachment;filename=" + path);
            res.send(image);
        }
    },
    resizeRoom: function(req, res) {
        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', mimetype);
            res.send(image);
        }
        var file = req.query.file;
        var filepath = './profileUploads/' + file;
        var isfile = sails.fs.existsSync(filepath);
        if (isfile == false) {
            var path = './profileUploads/noimage.jpg';
            var split = path.substr(path.length - 3);
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(split);
            res.set('Content-Type', mimetype);
            res.send(image);
        } else {
            showimage(filepath);
        }
    },
};
