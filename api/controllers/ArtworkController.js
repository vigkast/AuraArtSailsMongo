/**
 * ArtworkController
 *
 * @description :: Server-side logic for managing Artwork
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var filer = "http://www.auraart.in/user/resize?file=";
// var filer = "http://192.168.1.129:1337/user/resize?file=";
module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id) {
                    if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                        artwork();
                    } else {
                        res.json({
                            value: false,
                            comment: "Artwork-id is incorrect"
                        });
                    }
                } else {
                    artwork();
                }
            } else {
                res.json({
                    value: false,
                    comment: "user-id is incorrect "
                });
            }

            function artwork() {
                var print = function(data) {
                    res.json(data);
                }
                Artwork.save(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    saveFront: function(req, res) {
        if (req.body) {
            if (req.session.passport) {
                req.body.selleremail = req.session.passport.user.email;
                req.body.sellername = req.session.passport.user.name;
                artwork();
            } else {
                res.json({
                    value: false,
                    comment: "User not logged in"
                });
            }

            function artwork() {
                var print = function(data) {
                    res.json(data);
                }
                Artwork.saveFront(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    saveBack: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Artwork.saveBack(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Artwork-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Artwork.delete(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Artwork-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
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
    find: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                function callback(data) {
                    res.json(data);
                };
                Artwork.find(req.body, callback);
            } else {
                res.json({
                    value: false,
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
    findbyid: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Artwork.findbyid(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Artwork-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findall: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.findall(req.body, callback);
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Artwork.findlimited(req.body, callback);
                } else {
                    res.json({
                        value: false,
                        comment: "Please provide parameters"
                    });
                }
            } else {
                res.json({
                    value: false,
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
    findlimitedout: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Artwork.findlimitedout(req.body, callback);
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
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Artwork.findone(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Artwork-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
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
    deleteout: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Artwork.deleteout(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Artwork-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
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
    lastsr: function(req, res) {
        if (req.body) {
            function callback(data) {
                res.json(data);
            };
            Artwork.lastsr(req.body, callback);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    lastImage: function(req, res) {
        if (req.body) {
            if (req.body.type && req.body.type != "") {
                function callback(data) {
                    res.json(data);
                };
                Artwork.lastImage(req.body, callback);
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
    artworktype: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Artwork.artworktype(req.body, callback);
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
    favoriteartwork: function(req, res) {
        if (req.body) {
            if (req.body.artwork && req.body.artwork.length > 0) {
                function callback(data) {
                    res.json(data);
                };
                Artwork.favoriteartwork(req.body, callback);
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
    searchartwork: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Artwork.searchartwork(req.body, callback);
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
    searchdrop: function(req, res) {
        if (req.body) {
            if (req.body.search && req.body.search != "") {
                function callback(data) {
                    res.json(data);
                };
                Artwork.searchdrop(req.body, callback);
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
    findMyArtwork: function(req, res) {
        if (req.body) {
            if (req.session.passport && req.session.passport.user) {
                req.body.user = req.session.passport.user.id;

                function callback(data) {
                    res.json(data);
                };
                Artwork.findMyArtwork(req.body, callback);
            } else {
                res.json({
                    value: false,
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
    downloadImage: function(req, res) {
        console.log(req.query.image);
        var dimension = {};
        var options = {};
        var imageHeight = "";
        var imageWidth = "";
        var check = false;
        var arr = [];
        var split1 = req.query.image.split(".")[1];
        var split = req.query.image.split(".")[0];
        var filePath = filer + req.query.image + "&";
        var isfile = sails.fs.existsSync('./auraimg/' + req.query.image);
        var html = sails.fs.readFileSync('auraart.html', 'utf-8');
        if (isfile == true) {
            sails.gm('./auraimg/' + req.query.image).size(function(err, image) {
                console.log(err);
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        comment: err
                    });
                } else {
                    if (image.width >= image.height) {
                        filePath += "width=3024";
                        split += "_3024_0." + split1;
                        callResize();
                    } else {
                        filePath += "height=1944";
                        split += "_0_1944." + split1;
                        html = html.split("/*widthrow*/").join("width:2904px;");
                        check = true;
                        callResize();
                    }

                    function callResize() {
                        console.log(filePath);
                        sails.request.get({
                            url: filePath
                        }, function(err, http, body) {
                            console.log(err);
                            if (err) {
                                console.log(err);
                                res.json({
                                    value: false
                                });
                            } else {
                                setTimeout(function() {
                                    var isfile2 = sails.fs.existsSync('./' + req.query.image);
                                    if (isfile2) {
                                        var path = "./" + req.query.image;
                                        var image = sails.fs.readFileSync(path);
                                        var mimetype = sails.mime.lookup(path);
                                        res.set('Content-Type', "application/octet-stream");
                                        res.set('Content-Disposition', "attachment;filename=" + path);
                                        res.send(image);
                                    } else {
                                        sails.gm('./auraimg/' + split).size(function(err, image2) {
                                            console.log(err);
                                            if (err) {
                                                console.log(err);
                                                res.json({
                                                    value: false,
                                                    comment: "Error. Cannot Download Image."
                                                });
                                            } else {
                                                imageHeight = image2.height;
                                                imageWidth = image2.width;
                                                html = html.split("Artist").join(req.query.artist);
                                                html = html.split("Artwork").join(req.query.artwork);
                                                html = html.split("Medium").join(req.query.medium);
                                                html = html.split("Dim").join(req.query.dim);
                                                if (req.query.yoc && req.query.yoc != "") {
                                                    html = html.split(req.query.dim).join(req.query.dim + ", " + req.query.yoc);
                                                }
                                                html = html.split("http://www.auraart.in/user/resize?file=").join(filePath);
                                                // html = html.split("http://192.168.1.129:1337/user/resize?file=").join(filePath);
                                                if (check) {
                                                    options = {
                                                        windowSize: {
                                                            width: 3024,
                                                            height: imageHeight + 350
                                                        },
                                                        siteType: 'html'
                                                    };
                                                } else {
                                                    options = {
                                                        windowSize: {
                                                            width: imageWidth,
                                                            height: imageHeight + 350
                                                        },
                                                        siteType: 'html'
                                                    };
                                                }
                                                if (html && html != "") {
                                                    setTimeout(function() {
                                                        sails.webshot(html, "./" + req.query.image, options, function(err) {
                                                            console.log(err);
                                                            var isfile3 = sails.fs.existsSync('./' + req.query.image);
                                                            if (isfile3) {
                                                                var path = "./" + req.query.image;
                                                                var image = sails.fs.readFileSync(path);
                                                                var mimetype = sails.mime.lookup(path);
                                                                res.set('Content-Type', "application/octet-stream");
                                                                res.set('Content-Disposition', "attachment;filename=" + path);
                                                                res.send(image);
                                                                setTimeout(function() {
                                                                    sails.fs.unlink(path, function(data) {
                                                                        console.log(data);
                                                                    });
                                                                }, 30000);
                                                            }
                                                        });
                                                    }, 10000);
                                                }
                                            }
                                        });
                                    }
                                }, 10000);
                            }
                        });
                    }
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
    nextartwork: function(req, res) {
        if (req.body) {
            if (req.body.srno && req.body.srno != "" && req.body.type && req.body.type != "") {
                function callback(data) {
                    res.json(data);
                };
                Artwork.nextartwork(req.body, callback);
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
                                        m = result[num];
                                        db.collection('user').aggregate([{
                                            $unwind: "$artwork"
                                        }, {
                                            $match: {
                                                "artwork.imageno": m.imageno
                                            }
                                        }]).toArray(function(err, data2) {
                                            if (err) {
                                                console.log(err);
                                                res.json({
                                                    value: false,
                                                    comment: "Error"
                                                });
                                                db.close();
                                            } else if (data2 && data2.length > 0) {
                                                Artwork.save({
                                                    user: data2[0]._id,
                                                    _id: data2[0].artwork._id,
                                                    imageno: m.newno.toString()
                                                }, function(respo) {
                                                    num++;
                                                    if (num == result.length) {
                                                        res.json({
                                                            value: "true",
                                                            comment: "Done"
                                                        });
                                                        db.close();
                                                    } else {
                                                        createart(num);
                                                    }
                                                });
                                            } else {
                                                num++;
                                                if (num == result.length) {
                                                    res.json({
                                                        value: "true",
                                                        comment: "Done"
                                                    });
                                                    db.close();
                                                } else {
                                                    createart(num);
                                                }

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
    unwindImage: function(req, res) {
        res.connection.setTimeout(200000);
        req.connection.setTimeout(200000);
        User.findArtist(req.body, function(respo) {
            function abc(num) {
                x = respo[num];
                if (x.artwork && x.artwork.length > 0) {
                    function artCall(num2) {
                        y = x.artwork[num2];
                        if (y.imageno && (typeof y.imageno == 'object' || typeof y.imageno == 'array')) {
                            Artwork.save({
                                user: x._id,
                                _id: y._id,
                                imageno: y.imageno[0]
                            }, function(artRespo) {
                                num2++;
                                if (num2 == x.artwork.length) {
                                    num++;
                                    console.log(num);
                                    if (num == respo.length) {
                                        res.json({
                                            value: "true",
                                            comment: "Done"
                                        });
                                    } else {
                                        abc(num);
                                    }
                                } else {
                                    artCall(num2);
                                }
                            });
                        } else {
                            num2++;
                            if (num2 == x.artwork.length) {
                                num++;
                                console.log(num);
                                if (num == respo.length) {
                                    res.json({
                                        value: "true",
                                        comment: "Done"
                                    });
                                } else {
                                    abc(num);
                                }
                            } else {
                                artCall(num2);
                            }
                        }
                    }
                    artCall(0);
                } else {
                    num++;
                    console.log(num);
                    if (num == respo.length) {
                        res.json({
                            value: "true",
                            comment: "Done"
                        });
                    } else {
                        abc(num);
                    }
                }
            }
            abc(0);
        });
    },
    parseImage: function(req, res) {
        res.connection.setTimeout(200000);
        req.connection.setTimeout(200000);
        User.findArtist(req.body, function(respo) {
            function abc(num) {
                x = respo[num];
                if (x.artwork && x.artwork.length > 0) {
                    function artCall(num2) {
                        y = x.artwork[num2];
                        var updateObj = {};
                        if (y.imageno && y.imageno != "") {
                            updateObj = {
                                user: x._id,
                                _id: y._id,
                                imageno: parseInt(y.imageno)
                            };
                        } else {
                            updateObj = {
                                user: x._id,
                                _id: y._id,
                                imageno: -1
                            };
                        }
                        Artwork.save(updateObj, function(artRespo) {
                            num2++;
                            if (num2 == x.artwork.length) {
                                num++;
                                console.log(num);
                                if (num == respo.length) {
                                    res.json({
                                        value: "true",
                                        comment: "Done"
                                    });
                                } else {
                                    abc(num);
                                }
                            } else {
                                artCall(num2);
                            }
                        });
                    }
                    artCall(0);
                } else {
                    num++;
                    console.log(num);
                    if (num == respo.length) {
                        res.json({
                            value: "true",
                            comment: "Done"
                        });
                    } else {
                        abc(num);
                    }
                }
            }
            abc(0);
        });
    },
    updateSortSr: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                var sort = {};
                sort.focused = 1;
                sort.name = 1;
                sort['artwork.srno'] = 1;
                var matchobj = {
                    status: "approve",
                    artwork: {
                        $exists: true
                    },
                    $or: [{
                        "artwork.status": "approve"
                    }, {
                        "artwork.status": "sold"
                    }]
                };
                db.collection("user").aggregate([{
                    $match: matchobj
                }, {
                    $unwind: "$artwork"
                }, {
                    $match: matchobj
                }, {
                    $project: {
                        name: 1,
                        artwork: 1,
                        focused: 1
                    }
                }]).sort(sort).toArray(function(err, found) {
                    if (found && found[0]) {
                        function saveMe(num) {
                            data3 = found[num];
                            var num2 = num + 1;
                            Artwork.save({
                                _id: data3.artwork._id,
                                user: data3._id,
                                sortsr: num2
                            }, function(respo) {
                                num++;
                                console.log(num);
                                if (num == found.length) {
                                    res.json({
                                        value: true,
                                        comment: "Done"
                                    });
                                    db.close();
                                } else {
                                    saveMe(num);
                                }
                            });
                        }
                        saveMe(0);
                    } else if (err) {
                        console.log(err);
                        res.json({
                            value: false
                        });
                        db.close();
                    } else {
                        res.json({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    changeSculp: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false
                });
            } else {
                db.collection("user").aggregate([{
                    $unwind: "$artwork"
                }, {
                    $match: {
                        "artwork.type": "Sculptures",
                        "artwork.imageno": 500
                    }
                }, {
                    $project: {
                        _id: 1,
                        "artwork._id": 1,
                        "artwork.name": 1,
                        "artwork.type": 1
                    }
                }]).toArray(function(err, found) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false,
                            comment: err
                        });
                        db.close();
                    } else if (found && found.length > 0) {
                        function callMe(num) {
                            var xyz = found[num];
                            Artwork.lastImage({
                                type: xyz.artwork.type
                            }, function(lastRespo) {
                                if (lastRespo.value != false) {
                                    Artwork.save({
                                        user: xyz._id,
                                        _id: xyz.artwork._id,
                                        imageno: parseInt(lastRespo.imageno) + 1
                                    }, function(artRespo) {
                                        if (artRespo) {
                                            num++;
                                            if (num == found.length) {
                                                res.json({
                                                    value: true,
                                                    comment: found
                                                });
                                            } else {
                                                callMe(num);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        callMe(0);
                    }
                });
            }
        });
    },
    approveTime: function(req, res) {
        var arr = [];
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    comment: "Error"
                });
            } else {
                db.collection("user").aggregate([{
                    $unwind: "$artwork"
                }, {
                    $match: {
                        $or: [{
                            "artwork.status": "approve"
                        }, {
                            "artwork.status": "sold"
                        }],
                        "artwork.approveTimestamp": {
                            $exists: false
                        }
                    }
                }, {
                    $project: {
                        _id: 1,
                        "artwork._id": 1
                    }
                }]).toArray(function(err, found) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (found && found.length > 0) {
                        async.each(found, function(data2, callback) {
                            Artwork.save({
                                user: data2._id,
                                _id: data2.artwork._id,
                                approveTimestamp: new Date("2016-05-26")
                            }, function(respo2) {
                                if (respo2.value != false) {
                                    arr.push(data2);
                                    callback(err);
                                } else {
                                    arr.push(data2);
                                    callback(null);
                                }
                            });
                        }, function(err) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    value: false,
                                    comment: err
                                });
                                db.close();
                            } else {
                                res.json({
                                    value: true,
                                    comment: arr
                                });
                                db.close();
                            }
                        });
                    } else {
                        res.json({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    }
};
