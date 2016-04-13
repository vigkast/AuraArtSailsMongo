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
    downloadImage: function(req, res) {
        var dimension = {};
        var isfile = sails.fs.existsSync('./auraimg/' + req.query.image);
        if (isfile == true) {
            sails.lwip.open('./auraimg/' + req.query.image, function(err, image) {
                dimension.width = image.width() + 20;
                dimension.height = image.height() + 130;
                var html = sails.fs.readFileSync('auraart.html', 'utf-8');
                html = html.split("artist").join(req.query.artist);
                html = html.split("artwork").join(req.query.artwork);
                html = html.split("medium").join(req.query.medium);
                html = html.split("dim").join(req.query.dim);
                html = html.split("file=").join("file=" + req.query.image);
                var options = {
                    windowSize: dimension,
                    siteType: 'html'
                };
                if (html && html != "") {
                    sails.webshot(html, req.query.image, options, function(err) {
                        console.log(err);
                        var path = req.query.image;
                        var image = sails.fs.readFileSync(path);
                        var mimetype = sails.mime.lookup(path);
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(image);
                        setTimeout(function() {
                            sails.fs.unlink(path, function(data) {
                                console.log(data);
                            });
                        }, 10000);
                    });
                }
            });
        } else {
            var path = './auraimg/noimage.jpg';
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', mimetype);
            res.send(image);
        }
    },
};
