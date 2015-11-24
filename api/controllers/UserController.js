/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    uploadfile: function(req, res) {
        req.file("file").upload(function(err, uploadedFiles) {
            if (err) return res.send(500, err);
            _.each(uploadedFiles, function(n) {
                var oldpath = n.fd;
                var source = sails.fs.createReadStream(n.fd);
                n.fd = n.fd.split('\\').pop().split('/').pop();
                var dest = sails.fs.createWriteStream('./auraimg/' + n.fd);
                source.pipe(dest);
                source.on('end', function() {
                    sails.fs.unlink(oldpath, function(data) {
                        console.log(data);
                    });
                });
                source.on('error', function(err) {
                    console.log(err);
                });
            });
            return res.json({
                message: uploadedFiles.length + ' file(s) uploaded successfully!',
                files: uploadedFiles
            });
        });
    },
    excelobject: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload(function(err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function(n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function(err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function(data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function(data2) {});
                                        }
                                    });

                                    function createart(num) {
                                        excelimages = [];
                                        m = result[num];
                                        User.saveforexcel(m, function(print) {
                                            m.subtype = [];
                                            m.tag = [];
                                            var dummy = {};
                                            dummy._id = "";
                                            dummy.name = "";
                                            dummy.category = "";
                                            m.tag.push(dummy);
                                            if (!print.value && print.value != false) {
                                                createartwork();
                                            }

                                            function createartwork() {
                                                m.user = print;
                                                delete m.username;
                                                ArtMedium.savemediumexcel(m, function(mediumid) {
                                                    var mediumdata = {};
                                                    mediumdata._id = mediumid;
                                                    mediumdata.name = m.mediumname;
                                                    mediumdata.category = m.type;
                                                    m.subtype.push(mediumdata);
                                                    delete m.mediumname;
                                                    if (m.gprice != "") {
                                                        var gprice = m.gprice.split(",");
                                                        m.gprice = "";
                                                        _.each(gprice, function(gp) {
                                                            m.gprice += gp;
                                                        });
                                                        m.gprice = parseInt(m.gprice);
                                                    } else {
                                                        m.gprice = "N/A";
                                                    }
                                                    if (m.pricesq != "") {
                                                        var pricesq = m.pricesq.split(",");
                                                        m.pricesq = "";
                                                        _.each(pricesq, function(ps) {
                                                            m.pricesq += ps;
                                                        });
                                                        m.pricesq = parseInt(m.pricesq);
                                                    } else {
                                                        m.pricesq = "N/A";
                                                    }
                                                    if (m.price != "") {
                                                        var price = m.price.split(",");
                                                        m.price = "";
                                                        _.each(price, function(p) {
                                                            m.price += p;
                                                        });
                                                        m.price = parseInt(m.price);
                                                    } else {
                                                        m.price = "N/A";
                                                    }
                                                    if (m.height != "") {
                                                        m.height = parseFloat(m.height);
                                                    } else {
                                                        m.height = "N/A";
                                                    }
                                                    if (m.breadth != "") {
                                                        m.breadth = parseFloat(m.breadth);
                                                    } else {
                                                        m.breadth = "N/A";
                                                    }
                                                    if (m.width != "") {
                                                        m.width = parseFloat(m.width);
                                                    } else {
                                                        m.width = "N/A";
                                                    }
                                                    if (m.yoc == "") {
                                                        m.yoc = "N/A";
                                                    }
                                                    m.imageno = m.imageno.split(";");
                                                    _.each(m.imageno, function(z) {
                                                        excelimages.push(z.trim() + '.jpg');
                                                        if (m.imageno.length == excelimages.length) {
                                                            m.image = excelimages;
                                                            m.srno = num + 1;
                                                            Artwork.saveartwork(m);
                                                            console.log(num);
                                                            num++;
                                                            if (num < result.length) {
                                                                setTimeout(function() {
                                                                    createart(num);
                                                                }, 15);
                                                            } else {
                                                                console.log("Done");
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    }
                                    createart(0);
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    jsontoexcel: function(req, res) {
        var json = {
            foo: 'bar',
            qux: 'moo',
            poo: 123,
            stux: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        var xls = sails.json2xls(json);
        res.json("created");
        sails.fs.writeFileSync('./uploads/data.xlsx', xls, 'binary');
    },
    pdfgene: function(req, res) {
        var file = req.query.file;
        var filepath = './auraimg/' + file;
        var imagename = file.split('.');
        var imgs = ["./auraimg/" + file];
        var output = "./auraimg/" + imagename[0] + ".pdf";
        var isfile = sails.fs.existsSync(filepath);
        if (isfile == false) {
            res.json({
                comment: "No Such Image Found."
            });
        } else {
            var isfile2 = sails.fs.existsSync(output);
            if (isfile2 == false) {
                var slide = new sails.PDFImagePack();
                slide.output(imgs, output, function(err, doc) {
                    if (err) {
                        console.log(err);
                        res.json("Error");
                    } else if (doc) {
                        showpdf();
                    }
                });
            } else {
                showpdf();
            }
        }

        function showpdf() {
            var pdf = sails.fs.readFileSync(output);
            var mimetype = sails.mime.lookup(output);
            res.set('Content-Type', mimetype);
            res.send(pdf);
        }
    },
    resize: function(req, res) {
        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', mimetype);
            res.send(image);
        }

        function checknewfile(newfilepath, width, height) {
            width = parseInt(width);
            height = parseInt(height);
            newfilenamearr = newfilepath.split(".");
            extension = newfilenamearr.pop();
            var indexno = newfilepath.search("." + extension);
            var newfilestart = newfilepath.substr(0, indexno);
            var newfileend = newfilepath.substr(indexno, newfilepath.length);
            var newfilename = newfilestart + "_" + width + "_" + height + newfileend;
            var isfile2 = sails.fs.existsSync(newfilename);
            if (!isfile2) {
                console.log("in if");
                sails.lwip.open(newfilepath, function(err, image) {
                    var dimensions = {};
                    dimensions.width = image.width();
                    dimensions.height = image.height();
                    if (width == 0) {
                        width = dimensions.width / dimensions.height * height;
                    }
                    if (height == 0) {
                        height = dimensions.height / dimensions.width * width;
                    }
                    image.resize(width, height, "lanczos", function(err, image) {
                        image.toBuffer(extension, function(err, buffer) {
                            sails.fs.writeFileSync(newfilename, buffer);
                            showimage(newfilename);
                        });
                    });
                });
            } else {
                console.log("in else");
                showimage(newfilename);
            }
        }

        var file = req.query.file;
        var filepath = './auraimg/' + file;
        var newheight = req.query.height;
        var newwidth = req.query.width;
        var isfile = sails.fs.existsSync(filepath);
        if (isfile == false) {
            res.json({
                comment: "No Such Image Found."
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
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    user();
                } else {
                    res.json({
                        value: "false",
                        comment: "User-id is incorrect"
                    });
                }
            } else {
                user();
            }

            function user() {
                var print = function(data) {
                    res.json(data);
                }
                User.save(req.body, print);
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.find(req.body, print);
    },
    findbyletter: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.findbyletter(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
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
                User.findlimited(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
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
                User.findone(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findbyaccess: function(req, res) {
        if (req.body) {
            if (req.body.accesslevel && req.body.accesslevel != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.findbyaccess(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    searchmail: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.searchmail(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
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
                User.delete(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    login: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.login(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    adminlogin: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.adminlogin(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    changepassword: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                User.changepassword(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    forgotpassword: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.forgotpassword(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    countusers: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.countusers(req.body, print);
    },
    countartwork: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.countartwork(req.body, print);
    },
    saveforexcel: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.saveforexcel(req.body, print);
    },
    deletedata: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.deletedata(req.body, print);
    },
    findUser: function(req, res) {
        if (req.body) {
            if (req.body.search && req.body.search != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.findUser(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    userbytype: function(req, res) {
        if (req.body) {
            if (req.body.type && req.body.type != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.userbytype(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
};
