/**
 * ArtworkController
 *
 * @description :: Server-side logic for managing Artwork
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
        var dimension = {};
        var imagepath = "./assets/" + req.query.image;
        var patti = './assets/patti.jpg';
        var imageHeight = "";
        var arr = [];
        var isfile = sails.fs.existsSync('./auraimg/' + req.query.image);
        if (isfile == true) {
            sails.lwip.open('./auraimg/' + req.query.image, function(err, image) {
                dimension.width = 864;
                dimension.height = image.height();
                imageHeight = image.height();
                var html = sails.fs.readFileSync('auraart1.html', 'utf-8');
                html = html.split("file=").join("file=" + req.query.image);
                var options = {
                    windowSize: dimension,
                    siteType: 'html'
                };
                if (html && html != "") {
                    sails.webshot(html, imagepath, options, function(err) {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: false,
                                comment: err
                            });
                        } else {
                            arr.push({
                                image: imagepath,
                                left: 0,
                                top: 0
                            });
                            callPatti();
                        }
                    });
                }
            });

            function callPatti() {
                dimension.width = 864;
                dimension.height = 126;
                var html = sails.fs.readFileSync('auraart2.html', 'utf-8');
                html = html.split("Artist").join(req.query.artist);
                html = html.split("Artwork").join(req.query.artwork);
                html = html.split("Medium").join(req.query.medium);
                html = html.split("Dim").join(req.query.dim);
                var options = {
                    windowSize: dimension,
                    siteType: 'html'
                };
                if (html && html != "") {
                    sails.webshot(html, patti, options, function(err) {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: false,
                                comment: err
                            });
                        } else {
                            arr.push({
                                image: patti,
                                left: 0,
                                top: imageHeight
                            });
                            sails.lwip.create(864, imageHeight + 126, function(err, createImage) {
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        value: false,
                                        comment: Error
                                    });
                                } else {
                                    function callPaste(num) {
                                        var obj = arr[num];
                                        sails.lwip.open(obj.image, function(err, openImage) {
                                            if (err) {
                                                console.log(err);
                                                res.json({
                                                    value: false,
                                                    comment: Error
                                                });
                                            } else {
                                                createImage.paste(obj.left, obj.top, openImage, function(err, pasteImage) {
                                                    if (err) {
                                                        console.log(err);
                                                        res.json({
                                                            value: false,
                                                            comment: Error
                                                        });
                                                    } else {
                                                        createImage = pasteImage;
                                                        num++;
                                                        if (num == arr.length) {
                                                            pasteImage.toBuffer('jpg', {}, function(err, buffer) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    res.json({
                                                                        value: false,
                                                                        comment: Error
                                                                    });
                                                                } else {
                                                                    sails.fs.writeFileSync(req.query.image, buffer);
                                                                    var path = req.query.image;
                                                                    var image = sails.fs.readFileSync(path);
                                                                    res.set('Content-Type', "application/octet-stream");
                                                                    res.set('Content-Disposition', "attachment;filename=" + path);
                                                                    res.send(image);
                                                                    setTimeout(function() {
                                                                        sails.fs.unlink(path, function(data) {
                                                                            sails.fs.unlink(imagepath, function(data) {
                                                                                sails.fs.unlink(patti, function(data) {});
                                                                            });
                                                                        });
                                                                    }, 10000);
                                                                }
                                                            });
                                                        } else {
                                                            callPaste(num);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    callPaste(0);
                                }
                            });
                        }
                    });
                }
            }
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
                    $or: [{
                        "artwork.status": "approve"
                    }, {
                        "artwork.status": "sold"
                    }],
                    artwork: {
                        $exists: true
                    }
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
                            if (data3.artwork.sortsr && data3.artwork.sortsr != num2) {
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
                            } else {
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
                            }
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
    }
};
