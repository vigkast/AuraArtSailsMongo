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
    resizeImage: function(filename, width, height, style, res) {
        var readstream = sails.fs.createReadStream({
            filename: filename
        });
        readstream.on('error', function(err) {
            res.json({
                value: false,
                error: err
            });
        });

        function writer2(filename, gridFSFilename, metaValue) {
            var writestream2 = sails.fs.createWriteStream({
                filename: gridFSFilename
            });
            writestream2.on('finish', function() {
                sails.fs.unlink(filename);
            });
            sails.fs.createReadStream(filename).pipe(res);
            sails.fs.createReadStream(filename).pipe(writestream2);
        }

        function read2(filename2) {
            var readstream2 = sails.fs.createReadStream({
                filename: filename2
            });
            readstream2.on('error', function(err) {
                res.json({
                    value: false,
                    error: err
                });
            });
            readstream2.pipe(res);
        }
        var onlyName = filename.split(".")[0];
        var extension = filename.split(".").pop();
        if ((extension == "jpg" || extension == "png" || extension == "gif") && ((width && width > 0) || (height && height > 0))) {
            //attempt to get same size image and serve
            var newName = onlyName;
            if (width > 0) {
                newName += "-" + width;
            } else {
                newName += "-" + 0;
            }
            if (height) {
                newName += "-" + height;
            } else {
                newName += "-" + 0;
            }
            if (style && (style == "fill" || style == "cover")) {
                newName += "-" + style;
            } else {
                newName += "-" + 0;
            }
            var newNameExtire = newName + "." + extension;
            var isfile = sails.fs.existsSync(newNameExtire);
            if (found) {
                read2(newNameExtire);
            } else {
                var imageStream = fs.createWriteStream('./auraimg/' + filename);
                readstream.pipe(imageStream);
                imageStream.on("finish", function() {
                    sails.lwip.open('./auraimg/' + filename, function(err, image) {
                        ImageWidth = image.width();
                        ImageHeight = image.height();
                        var newWidth = 0;
                        var newHeight = 0;
                        var pRatio = width / height;
                        var iRatio = ImageWidth / ImageHeight;
                        if (width && height) {
                            newWidth = width;
                            newHeight = height;
                            switch (style) {
                                case "fill":
                                    if (pRatio > iRatio) {
                                        newHeight = height;
                                        newWidth = height * (ImageWidth / ImageHeight);
                                    } else {
                                        newWidth = width;
                                        newHeight = width / (ImageWidth / ImageHeight);
                                    }
                                    break;
                                case "cover":
                                    if (pRatio < iRatio) {
                                        newHeight = height;
                                        newWidth = height * (ImageWidth / ImageHeight);
                                    } else {
                                        newWidth = width;
                                        newHeight = width / (ImageWidth / ImageHeight);
                                    }
                                    break;
                            }
                        } else if (width) {
                            newWidth = width;
                            newHeight = width / (ImageWidth / ImageHeight);
                        } else if (height) {
                            newWidth = height * (ImageWidth / ImageHeight);
                            newHeight = height;
                        }
                        image.resize(parseInt(newWidth), parseInt(newHeight), function(err, image2) {
                            image2.writeFile('./auraimg/' + filename, function(err) {
                                writer2('./auraimg/' + filename, newNameExtire, {
                                    width: newWidth,
                                    height: newHeight
                                });
                            });
                        });
                    });
                });
                //else create a resized image and serve
            }
        } else {
            readstream.pipe(res);
        }
    },
    downloadImage: function(req, res) {
        var dimension = {};
        var imagepath = "./assets/" + req.query.image;
        var patti = './assets/patti.jpg';
        var imageHeight = "";
        var imageWidth = "";
        var arr = [];
        var isfile = sails.fs.existsSync('./auraimg/' + req.query.image);
        if (isfile == true) {
            var html = sails.fs.readFileSync('auraart1.html', 'utf-8');
            sails.lwip.open('./auraimg/' + req.query.image, function(err, image) {
                if ((image.width() / image.height()) > (14 / 9)) {
                    dimension.width = 1008;
                    dimension.height = image.height();
                    html = html.split("file=").join("file=" + req.query.image + "&width=1008");
                } else {
                    dimension.width = image.width();
                    dimension.height = 648;
                    html = html.split("file=").join("file=" + req.query.image + "&height=648");
                }
                // dimension.width = 864;
                // dimension.height = image.height();
                imageWidth = dimension.width;
                imageHeight = dimension.height;
                var options = {
                    windowSize: {
                        width: 1008,
                        height: imageHeight
                    },
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
                dimension.width = 1008;
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
                            sails.lwip.create(1008, imageHeight + 126, function(err, createImage) {
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
