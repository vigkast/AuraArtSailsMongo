/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require("request").defaults({
    encoding: null
});
var writedata = "";
module.exports = {
    uploadfile: function (req, res) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            }
            req.file("file").upload({
                maxBytes: 100000000
            }, function (err, uploadedFiles) {
                if (err) {
                    return res.send(500, err);
                }
                _.each(uploadedFiles, function (n) {
                    var filepath = n.fd;
                    var newfilepath = n.fd;
                    var newfilenamearr = newfilepath.split(".");
                    var extension = newfilenamearr.pop();
                    var mimetype = sails.mime.lookup(n.fd);
                    var newdate = sails.moment(new Date()).format('YYYY-MM-DDh-mm-ss-SSSSa');
                    var filename = 'image' + newdate + '.' + extension;
                    db.open(function (err, db) {
                        var fileId = new sails.ObjectID();
                        var gridStore = new sails.GridStore(db, fileId, filename, 'w', {
                            content_type: mimetype
                        });
                        gridStore.open(function (err, gridStore) {
                            gridStore.writeFile(filepath, function (err, doc) {
                                sails.GridStore.read(db, fileId, function (err, fileData) {
                                    var buffr = fileData;
                                    res.json(fileId);
                                    sails.fs.unlink(filepath, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    excelobject: function (req, res) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function (err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
                        var extension = "";
                        var mimetype = "";
                        var excelimages = [];
                        req.file("file").upload(function (err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function (n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function (err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function (data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function (data2) {});
                                        }
                                    });

                                    function createart(num) {
                                        excelimages = [];
                                        m = result[num];
                                        User.saveforexcel(m, function (print) {
                                            m.subtype = [];
                                            if (print != undefined) {
                                                m.user = print;
                                                if (m.user != undefined) {
                                                    delete m.username;
                                                    ArtMedium.savemediumexcel(m, function (mediumid) {
                                                        var mediumdata = {};
                                                        mediumdata._id = mediumid;
                                                        mediumdata.name = m.mediumname;
                                                        mediumdata.category = m.type;
                                                        m.subtype.push(mediumdata);
                                                        delete m.mediumname;
                                                        m.imageno = m.imageno.split(";");
                                                        _.each(m.imageno, function (z) {
                                                            var imagewithext = z.trim() + '.jpg';
                                                            extension = z.split('.');
                                                            mimetype = "image/jpeg";
                                                            if (extension[0] == 'jpg') {
                                                                mimetype = 'image/jpeg';
                                                            } else if (extension[0] == 'png') {
                                                                mimetype = 'image/png';
                                                            } else if (extension[0] == 'gif') {
                                                                mimetype = 'image/gif';
                                                            }
                                                            request.get("http://wohlig.co.in/auraimg/" + imagewithext, function (err, d2, imagebuf) {

                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                                if (imagebuf) {
                                                                    var fileId = sails.ObjectID();
                                                                    var gridStore = new sails.GridStore(db, fileId, 'w', {
                                                                        content_type: mimetype
                                                                    });
                                                                    gridStore.open(function (err, gridStore) {
                                                                        if (err) {
                                                                            console.log(err);
                                                                        }
                                                                        if (gridStore) {
                                                                            gridStore.write(imagebuf, function (err, doc) {
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                }
                                                                                if (doc) {
                                                                                    gridStore.close(function () {
                                                                                        excelimages.push(fileId);
                                                                                        if (m.imageno.length == excelimages.length) {
                                                                                            m.image = excelimages;
                                                                                            m.srno = num + 1;
                                                                                            Artwork.saveartwork(m);
                                                                                            console.log(num);
                                                                                            num++;
                                                                                            if (num != result.length) {
                                                                                                createart(num);
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    });
                                                }
                                            } else {
                                                num++;
                                                createart(num);
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
    jsontoexcel: function (req, res) {
        console.log("in json function");
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
    resize: function (req, res) {
        var file = req.param('file');
        var fd = sails.ObjectID(file);
        var newheight = req.param('height');
        var newwidth = req.param('width');
        if (!newwidth && !newheight) {
            showimage(fd);
        } else if (!newwidth && newheight) {
            newheight = parseInt(newheight);
            findimage(fd, 0, newheight);
        } else if (newwidth && !newheight) {
            newwidth = parseInt(newwidth);
            findimage(fd, newwidth, 0);
        } else {
            findimage(fd, newwidth, newheight);
        }

        function findimage(fd, newwidth, newheight) {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                }
                sails.GridStore.read(db, fd, function (err, fileData) {
                    width = parseInt(newwidth);
                    height = parseInt(newheight);
                    sails.lwip.open(fileData, 'jpg', function (err, image) {
                        var dimensions = {};
                        dimensions.width = image.width();
                        dimensions.height = image.height();
                        if (width == 0) {
                            width = dimensions.width / dimensions.height * height;
                        }
                        if (height == 0) {
                            height = dimensions.height / dimensions.width * width;
                        }
                        if (err) {
                            console.log(err);
                        }
                        image.resize(width, height, "lanczos", function (err, image2) {
                            db.open(function (err, db) {
                                var fileId = new sails.ObjectID();
                                var mimetype = "image/jpeg";
                                image2.toBuffer("jpg", {}, function (err, imagebuf) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    if (imagebuf) {
                                        res.set('Content-Type', mimetype);
                                        res.send(new Buffer(imagebuf));
                                    }
                                });
                            });
                        });
                    });

                });
            });
        }

        function showimage(oldfile) {
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                }
                var filename = oldfile;
                var file = new sails.GridStore(db, filename, "r");
                file.open(function (err, file) {
                    if (err) {
                        console.log(err);
                    }
                    res.set('Content-Type', file.contentType);
                    var stream = file.stream();
                    stream.pipe(res);
                });
            });
        }
    },
    findimage: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findimage(req.body, print);
    },
    countimage: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.countimage(req.body, print);
    },
    removeimage: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.removeimage(req.body, print);
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
    findbyletter: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findbyletter(req.body, print);
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
    findbyaccess: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findbyaccess(req.body, print);
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
    adminlogin: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.adminlogin(req.body, print);
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
    },
    countartwork: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.countartwork(req.body, print);
    },
    saveforexcel: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.saveforexcel(req.body, print);
    },
    deletedata: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.deletedata(req.body, print);
    }
};