/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var lwip = require('lwip');
var mime = require('mime');
module.exports = {
    uploadfile: function (req, res) {
        req.file("file").upload(function (err, uploadedFiles) {
            if (err) return res.send(500, err);
            _.each(uploadedFiles, function (n) {
                var oldpath = n.fd;
                var source = sails.fs.createReadStream(n.fd);
                n.fd = n.fd.split("/").pop();
                var dest = sails.fs.createWriteStream('./uploads/' + n.fd);
                source.pipe(dest);
                source.on('end', function () {
                    sails.fs.unlink(oldpath, function (data) {
                        console.log(data);
                    });
                });
                source.on('error', function (err) {
                    console.log(err);
                });
            });
            return res.json({
                message: uploadedFiles.length + ' file(s) uploaded successfully!',
                files: uploadedFiles
            });
        });
    },
    //    resize2: function (req, res) {
    //        sails.im.resize({
    //            srcData: fs.readFileSync('./uploads/demo.png', 'binary'),
    //            width: 1000,
    //            height: 10000
    //        }, function (err, stdout, stderr) {
    //            sails.fs.writeFileSync('./uploads/kittens-resized.jpg', stdout, 'binary');
    //            console.log('resized kittens.jpg to fit within 256x256px')
    //        });
    //    },
    resize: function (req, res, extension) {
        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            var mimetype = mime.lookup(path);
            res.set('Content-Type', mimetype);
            res.send(image);
        }

        function checknewfile(newfilepath, width, height) {
            width = parseInt(width);
            height = parseInt(height);
            newfilenamearr = newfilepath.split(".");
            extension = newfilenamearr.pop();
            var newfilename = ".";
            _.each(newfilenamearr, function (n) {
                newfilename += n;
            });

            newfilename += "_" + width + "_" + height + "." + extension;
            var isfile2 = sails.fs.existsSync(newfilename);
            if (!isfile2) {

                lwip.open(newfilepath, function (err, image) {

                    var dimensions = {};
                    dimensions.width = image.width();
                    dimensions.height = image.height();
                    if (width == 0) {
                        width = dimensions.width / dimensions.height * height;
                    }
                    if (height == 0) {
                        height = dimensions.height / dimensions.width * width;
                    }
                    console.log(err);
                    image.resize(width, height, "lanczos", function (err, image) {

                        // check err...
                        // manipulate some more:
                        image.toBuffer(extension, function (err, buffer) {

                            sails.fs.writeFileSync(newfilename, buffer);
                            showimage(newfilename);
                            // check err...
                            // save buffer to disk / send over network / etc.

                        });

                    });

                });

            } else {
                showimage(newfilename);
            }
        }

        var file = req.query.file;
        var filepath = './uploads/' + file;
        var newheight = req.query.height;
        var newwidth = req.query.width;


        var isfile = sails.fs.existsSync(filepath);
        if (!isfile) {
            res.json({
                message: "File not found",
                value: "false"
            });
        } else {

            if (!newwidth && !newheight) {
                showimage(filepath);
            } else if (!newwidth && newheight) {
                newheight = parseInt(newheight);
                checknewfile(filepath, 0, newheight);
            } else if (newwidth && !newheight) {
                newwidth = parseInt(newwidth);
                checknewfile(filepath, newwidth, 0);
            } else {
                checknewfile(filepath, newwidth, newheight);
            }
        }
    },
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findone(req.body, print);
    },
    searchmail: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.searchmail(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.delete(req.body, print);
    },
    login: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.login(req.body, print);
    },
    changepassword: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.changepassword(req.body, print);
    },
    forgotpassword: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.forgotpassword(req.body, print);
    },
    countusers: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.countusers(req.body, print);
    }

};