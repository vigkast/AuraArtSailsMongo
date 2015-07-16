/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var lwip = require('lwip');

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
    resize: function (req, res) {
        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            res.set('Content-Type', 'image/png');
            res.send(image);
        }

        function checknewfile(newfilepath, width, height) {
            newfilenamearr = newfilepath.split(".");
            extension = newfilenamearr.pop();
            var newfilename = "";
            _.each(newfilename, function (n) {
                newfilename += n;
            });
            newfilename += "_" + width + "_" + height + extension;
            var isfile2 = sails.fs.existsSync(newfilename);
            if (!isfile2) {

                lwip.open(newfilepath, function (err, image) {

                    // check err...
                    // manipulate image:
                    image.resize(width, height, "lanczos", function (err, image) {

                        // check err...
                        // manipulate some more:
                        image.toBuffer('png', function (err, buffer) {

                            sails.fs.writeFileSync('./uploads/' + newfilename, buffer);
                            showimage('./uploads/' + newfilename);
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
                newwidth = dimensions.width / dimensions.height * newheight;
                checknewfile(filepath, newwidth, newheight);
            } else if (newwidth && !newheight) {
                newwidth = parseInt(newwidth);
                newheight = dimensions.height / dimensions.width * newwidth;
                checknewfile(filepath, newwidth, newheight);
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