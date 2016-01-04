/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// var frontend = "http://localhost/manjhi/";
var frontend = "http://wohlig.co.in/auraart/";

var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new TwitterStrategy({
        consumerKey: "LPazfO26oP6KrjYCWlQJfUZq1",
        consumerSecret: "SJ8tuzeiGvM7YZvRoHqXSk8LLThpn6DPg2BMtuBrgR9n01DQBD",
        callbackURL: sails.myurl + "user/callbackt"
    },
    function(token, tokenSecret, profile, done) {
        profile.token = token;
        profile.tokenSecret = tokenSecret;
        profile.provider = "Twitter";
        User.findorcreate(profile, done);
    }
));
passport.use(new FacebookStrategy({
        clientID: "1475701386072240",
        clientSecret: "6e46460c7bb3fb4f06182d89eb7514b9",
        callbackURL: sails.myurl + "user/callbackf"
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.provider = "Facebook";
        User.findorcreate(profile, done);
    }
));

passport.use(new GoogleStrategy({
        clientID: "265970827010-6cd2gg8psketq39smq2bsfueksgceu4c.apps.googleusercontent.com",
        clientSecret: "BYCjnvwCyassATSS444z8_Ok",
        callbackURL: "callbackg"
    },
    function(token, tokenSecret, profile, done) {
        profile.token = token;
        profile.tokenSecret = tokenSecret;
        profile.provider = "Google";
        // console.log(profile);
        User.findorcreate(profile, done);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});
module.exports = {
    //////////////////////////////
    // LOGIN FUNCTIONS
    logint: function(req, res) {
        var user = req.param("user");

        passport.use(new TwitterStrategy({
                consumerKey: "LPazfO26oP6KrjYCWlQJfUZq1",
                consumerSecret: "SJ8tuzeiGvM7YZvRoHqXSk8LLThpn6DPg2BMtuBrgR9n01DQBD",
                callbackURL: sails.myurl + "user/callbackt"
            },
            function(token, tokenSecret, profile, done) {
                profile.token = token;
                profile.tokenSecret = tokenSecret;
                profile.provider = "Twitter";
                if (user && sails.ObjectID.isValid(user)) {
                    profile._id = user;
                }
                User.findorcreate(profile, done);
            }
        ));

        var loginid = req.param("loginid");
        req.session.loginid = loginid;
        passport.authenticate('twitter')(req, res);
    },
    loginf: function(req, res) {
        var user = req.param("user");

        passport.use(new FacebookStrategy({
                clientID: "1475701386072240",
                clientSecret: "6e46460c7bb3fb4f06182d89eb7514b9",
                callbackURL: sails.myurl + "user/callbackf"
            },
            function(accessToken, refreshToken, profile, done) {
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;
                profile.provider = "Facebook";
                if (user && sails.ObjectID.isValid(user)) {
                    profile._id = user;
                }
                User.findorcreate(profile, done);
            }
        ));

        var loginid = req.param("loginid");
        req.session.loginid = loginid;
        passport.authenticate('facebook', {
            scope: 'email,public_profile,publish_actions'
        })(req, res);
    },
    loging: function(req, res) {
        var user = req.param("user");

        passport.use(new GoogleStrategy({
                clientID: "265970827010-6cd2gg8psketq39smq2bsfueksgceu4c.apps.googleusercontent.com",
                clientSecret: "BYCjnvwCyassATSS444z8_Ok",
                callbackURL: "callbackg"
            },
            function(token, tokenSecret, profile, done) {
                profile.token = token;
                profile.provider = "Google";
                User.findorcreate(profile, done);
            }
        ));

        var loginid = req.param("loginid");
        req.session.loginid = loginid;
        passport.authenticate('google', {
            scope: "openid profile email"
        })(req, res);
    },
    callbackt: passport.authenticate('twitter', {
        successRedirect: frontend,
        failureRedirect: '/user/fail'
    }),
    callbackg: passport.authenticate('google', {
        successRedirect: frontend,
        failureRedirect: '/user/fail'
    }),
    callbackf: passport.authenticate('facebook', {
        successRedirect: frontend,
        failureRedirect: '/user/fail'
    }),
    success: function(req, res, data) {
        if (req.session.passport) {
            sails.sockets.blast("login", {
                loginid: req.session.loginid,
                status: "success",
                user: req.session.passport.user
            });
        }
        res.view("success");
    },
    fail: function(req, res) {
        sails.sockets.blast("login", {
            loginid: req.session.loginid,
            status: "fail"
        });
        res.view("fail");
    },
    profile: function(req, res) {
        if (req.session.passport) {
            res.json(req.session.passport.user);
        } else {
            res.json({});
        }
    },
    logout: function(req, res) {
        req.session.destroy(function(err) {
            res.send(req.session);
        });
    },
    findorcreate: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.findorcreate(req.body, print);
    },
    //////////////////////////////
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
                                            if (m.tagname == "") {
                                                var dummy = {};
                                                dummy._id = "";
                                                dummy.name = "";
                                                dummy.category = "";
                                                m.tag.push(dummy);
                                            }
                                            User.saveCustomer(m, function(printcust) {
                                                if (printcust.value != false) {
                                                    createartwork();
                                                }

                                                function createartwork() {
                                                    m.reseller = printcust;
                                                    m.user = print;
                                                    delete m.username;
                                                    ArtMedium.savemediumexcel(m, function(mediumid) {
                                                        var mediumdata = {};
                                                        mediumdata._id = mediumid;
                                                        mediumdata.name = m.mediumname;
                                                        mediumdata.category = m.type;
                                                        m.subtype.push(mediumdata);
                                                        delete m.mediumname;
                                                        if (m.tagname != "") {
                                                            var tagsplit = m.tagname.split(",");
                                                            var count = 0;
                                                            _.each(tagsplit, function(q) {
                                                                q = q.trim();
                                                                var tagdata = {};
                                                                tagdata.name = q;
                                                                tagdata.type = m.type;
                                                                Tag.savetagexcel(tagdata, function(tagid) {
                                                                    tagdata._id = tagid;
                                                                    m.tag.push(tagdata);
                                                                    count++;
                                                                    if (count == tagsplit.length) {
                                                                        creator();
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            creator();
                                                        }

                                                        function creator() {
                                                            delete m.tagname;
                                                            if (m.gprice && m.gprice != "") {
                                                                var gprice = m.gprice.split(",");
                                                                m.gprice = "";
                                                                _.each(gprice, function(gp) {
                                                                    m.gprice += gp;
                                                                });
                                                                m.gprice = parseInt(m.gprice);
                                                            } else {
                                                                m.gprice = "N/A";
                                                            }
                                                            if (m.pricesq && m.pricesq != "") {
                                                                var pricesq = m.pricesq.split(",");
                                                                m.pricesq = "";
                                                                _.each(pricesq, function(ps) {
                                                                    m.pricesq += ps;
                                                                });
                                                                m.pricesq = parseInt(m.pricesq);
                                                            } else {
                                                                m.pricesq = "N/A";
                                                            }
                                                            if (m.price && m.price != "") {
                                                                var price = m.price.split(",");
                                                                m.price = "";
                                                                _.each(price, function(p) {
                                                                    m.price += p;
                                                                });
                                                                m.price = parseInt(m.price);
                                                            } else {
                                                                m.price = "N/A";
                                                            }
                                                            if (m.height && m.height != "") {
                                                                m.height = parseFloat(m.height);
                                                            } else {
                                                                m.height = "N/A";
                                                            }
                                                            if (m.breadth && m.breadth != "") {
                                                                m.breadth = parseFloat(m.breadth);
                                                            } else {
                                                                m.breadth = "N/A";
                                                            }
                                                            if (m.width && m.width != "") {
                                                                m.width = parseFloat(m.width);
                                                            } else {
                                                                m.width = "N/A";
                                                            }
                                                            if (m.yoc && m.yoc == "") {
                                                                m.yoc = "N/A";
                                                            }
                                                            m.imageno = m.imageno.split(";");
                                                            _.each(m.imageno, function(z) {
                                                                excelimages.push(z.trim() + '.jpg');
                                                                if (m.imageno.length == excelimages.length) {
                                                                    m.image = excelimages;
                                                                    m.srno = num + 1;
                                                                    m.srno = parseInt(m.srno);
                                                                    delete m.style;
                                                                    delete m.elements;
                                                                    delete m.color;
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
                                                        }
                                                    });
                                                }
                                            });
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
    updateArtist: function(req, res) {
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

                                    function createteam(num) {
                                        if (result[num] && result[num].username != "") {
                                            var donated = {};
                                            var i = 0;
                                            m = result[num];
                                            if (m.dob && m.dob != "") {
                                                if (m.dob.indexOf("-") != -1 || m.dob.indexOf("/") != -1) {
                                                    donated.dob = new Date(m.dob);
                                                } else {
                                                    donated.dob = m.dob;
                                                }
                                            } else {
                                                delete m.dob;
                                            }
                                            donated.passedaway = m.passedaway;
                                            donated.stateofb = m.stateofb;
                                            User.findforexcel(m, function(dorespo) {
                                                if (dorespo.value != false) {
                                                    if (dorespo.edu && dorespo.edu[0]) {
                                                        var newdata = {};
                                                        donated._id = dorespo._id;
                                                        donated.edu = dorespo.edu;
                                                        if (m.eduyear != "") {
                                                            newdata.year = m.eduyear;
                                                        } else {
                                                            newdata.year = "";
                                                        }
                                                        if (m.qualification != "") {
                                                            newdata.quali = m.qualification;
                                                        } else {
                                                            newdata.quali = "";
                                                        }
                                                        if (m.institution) {
                                                            newdata.institu = m.institution;
                                                        } else {
                                                            newdata.institu = "";
                                                        }
                                                        if (m.city) {
                                                            newdata.city = m.city;
                                                        } else {
                                                            newdata.city = "";
                                                        }
                                                        donated.edu.push(newdata);
                                                        i++;
                                                        saveupdate();
                                                    } else {
                                                        var newdata = {};
                                                        donated._id = dorespo._id;
                                                        donated.edu = [];
                                                        if (m.eduyear != "") {
                                                            newdata.year = m.eduyear;
                                                        } else {
                                                            newdata.year = "";
                                                        }
                                                        if (m.qualification != "") {
                                                            newdata.quali = m.qualification;
                                                        } else {
                                                            newdata.quali = "";
                                                        }
                                                        if (m.institution) {
                                                            newdata.institu = m.institution;
                                                        } else {
                                                            newdata.institu = "";
                                                        }
                                                        if (m.city) {
                                                            newdata.city = m.city;
                                                        } else {
                                                            newdata.city = "";
                                                        }
                                                        donated.edu.push(newdata);
                                                        i++;
                                                        saveupdate();
                                                    }
                                                    if (dorespo.soloshow && dorespo.soloshow[0]) {
                                                        var solodata = {};
                                                        donated.soloshow = dorespo.soloshow;
                                                        if (m.soloyear != "") {
                                                            solodata.year = m.soloyear;
                                                        } else {
                                                            solodata.year = "";
                                                        }
                                                        if (m.solotitle != "") {
                                                            solodata.title = m.solotitle;
                                                        } else {
                                                            solodata.title = "";
                                                        }
                                                        if (m.sologallery) {
                                                            solodata.gallery = m.sologallery;
                                                        } else {
                                                            solodata.gallery = "";
                                                        }
                                                        if (m.solovenue) {
                                                            solodata.city = m.solovenue;
                                                        } else {
                                                            solodata.city = "";
                                                        }
                                                        donated.soloshow.push(solodata);
                                                        i++;
                                                        saveupdate();
                                                    } else {
                                                        donated.soloshow = [];
                                                        var solodata = {};
                                                        if (m.soloyear != "") {
                                                            solodata.year = m.soloyear;
                                                        } else {
                                                            solodata.year = "";
                                                        }
                                                        if (m.solotitle != "") {
                                                            solodata.title = m.solotitle;
                                                        } else {
                                                            solodata.title = "";
                                                        }
                                                        if (m.sologallery) {
                                                            solodata.gallery = m.sologallery;
                                                        } else {
                                                            solodata.gallery = "";
                                                        }
                                                        if (m.solovenue) {
                                                            solodata.city = m.solovenue;
                                                        } else {
                                                            solodata.city = "";
                                                        }
                                                        donated.soloshow.push(solodata);
                                                        i++;
                                                        saveupdate();
                                                    }
                                                    if (dorespo.groupshow && dorespo.groupshow[0]) {
                                                        var grpdata = {};
                                                        donated.groupshow = dorespo.groupshow;
                                                        if (m.grpyear != "") {
                                                            grpdata.year = m.grpyear;
                                                        } else {
                                                            grpdata.year = "";
                                                        }
                                                        if (m.solotitle != "") {
                                                            grpdata.title = m.grptitle;
                                                        } else {
                                                            grpdata.title = "";
                                                        }
                                                        if (m.grpgallery) {
                                                            grpdata.gallery = m.grpgallery;
                                                        } else {
                                                            grpdata.gallery = "";
                                                        }
                                                        if (m.grpvenue) {
                                                            grpdata.venue = m.grpvenue;
                                                        } else {
                                                            grpdata.venue = "";
                                                        }
                                                        donated.groupshow.push(grpdata);
                                                        i++;
                                                        saveupdate();
                                                    } else {
                                                        donated.groupshow = [];
                                                        var grpdata = {};
                                                        if (m.grpyear != "") {
                                                            grpdata.year = m.grpyear;
                                                        } else {
                                                            grpdata.year = "";
                                                        }
                                                        if (m.solotitle != "") {
                                                            grpdata.title = m.grptitle;
                                                        } else {
                                                            grpdata.title = "";
                                                        }
                                                        if (m.grpgallery) {
                                                            grpdata.gallery = m.grpgallery;
                                                        } else {
                                                            grpdata.gallery = "";
                                                        }
                                                        if (m.grpvenue) {
                                                            grpdata.venue = m.grpvenue;
                                                        } else {
                                                            grpdata.venue = "";
                                                        }
                                                        donated.groupshow.push(grpdata);
                                                        i++;
                                                        saveupdate();
                                                    }
                                                    if (dorespo.award && dorespo.award[0]) {
                                                        var awardData = {};
                                                        donated.award = dorespo.award;
                                                        if (m.awardyear != "") {
                                                            awardData.year = m.awardyear;
                                                        } else {
                                                            awardData.year = "";
                                                        }
                                                        if (m.awardtitle != "") {
                                                            awardData.title = m.awardtitle;
                                                        } else {
                                                            awardData.title = "";
                                                        }
                                                        if (m.awardinstitution) {
                                                            awardData.institution = m.awardinstitution;
                                                        } else {
                                                            awardData.institution = "";
                                                        }
                                                        donated.award.push(awardData);
                                                        i++;
                                                        saveupdate();
                                                    } else {
                                                        donated.award = [];
                                                        var awardData = {};
                                                        if (m.awardyear != "") {
                                                            awardData.year = m.awardyear;
                                                        } else {
                                                            awardData.year = "";
                                                        }
                                                        if (m.awardtitle != "") {
                                                            awardData.title = m.awardtitle;
                                                        } else {
                                                            awardData.title = "";
                                                        }
                                                        if (m.awardinstitution) {
                                                            awardData.institution = m.awardinstitution;
                                                        } else {
                                                            awardData.institution = "";
                                                        }
                                                        donated.award.push(awardData);
                                                        i++;
                                                        saveupdate();
                                                    }
                                                    if (dorespo.auction && dorespo.auction[0]) {
                                                        var auctiondata = {};
                                                        donated.auction = dorespo.auction;
                                                        if (m.aucyear != "") {
                                                            auctiondata.year = m.aucyear;
                                                        } else {
                                                            auctiondata.year = "";
                                                        }
                                                        if (m.auctionhouse != "") {
                                                            auctiondata.auctionhouse = m.auctionhouse;
                                                        } else {
                                                            auctiondata.auctionhouse = "";
                                                        }
                                                        if (m.location) {
                                                            auctiondata.location = m.location;
                                                        } else {
                                                            auctiondata.location = "";
                                                        }
                                                        donated.auction.push(auctiondata);
                                                        i++;
                                                        saveupdate();
                                                    } else {
                                                        donated.auction = [];
                                                        var auctiondata = {};
                                                        if (m.aucyear != "") {
                                                            auctiondata.year = m.aucyear;
                                                        } else {
                                                            auctiondata.year = "";
                                                        }
                                                        if (m.auctionhouse != "") {
                                                            auctiondata.auctionhouse = m.auctionhouse;
                                                        } else {
                                                            auctiondata.auctionhouse = "";
                                                        }
                                                        if (m.location) {
                                                            auctiondata.location = m.location;
                                                        } else {
                                                            auctiondata.location = "";
                                                        }
                                                        donated.auction.push(auctiondata);
                                                        i++;
                                                        saveupdate();
                                                    }

                                                    function saveupdate() {
                                                        if (i == 5) {
                                                            User.save(donated, function(respo) {
                                                                if (respo.value && respo.value == true) {
                                                                    num++;
                                                                    console.log(num);
                                                                    if (num < result.length) {
                                                                        setTimeout(function() {
                                                                            createteam(num);
                                                                        }, 15);
                                                                    } else {
                                                                        res.json("Done");
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    num++;
                                                    console.log(num);
                                                    if (num < result.length) {
                                                        setTimeout(function() {
                                                            createteam(num);
                                                        }, 15);
                                                    } else {
                                                        res.json("Done");
                                                    }
                                                }
                                            });
                                        } else {
                                            num++;
                                            console.log(num);
                                            if (num < result.length) {
                                                setTimeout(function() {
                                                    createteam(num);
                                                }, 15);
                                            } else {
                                                res.json("Done");
                                            }
                                        }
                                    }
                                    createteam(0);
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
            var path = './auraimg/noimage.jpg';
            var split = path.substr(path.length - 3);
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(split);
            res.set('Content-Type', mimetype);
            res.send(image);
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
                    if (data.accesslevel && data.accesslevel == "customer") {
                        req.session.passport = {
                            user: data
                        };
                        if (req.session.cart && req.session.cart.items.length > 0) {
                            var i = 0;
                            _.each(req.session.cart.items, function(art) {
                                art.id = req.session.passport.user.id;
                                Cart.save(art, function(cartrespo) {
                                    i++;
                                    if (i == req.session.cart.items.length) {
                                        req.session.cart = {};
                                        res.json(data);
                                    }
                                });
                            });
                        } else {
                            res.json(data);
                        }
                    } else {
                        res.json(data);
                    }

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
                    if (data.value != false) {
                        req.session.passport = {
                            user: data
                        };
                        if (req.session.cart && req.session.cart.items.length > 0) {
                            var i = 0;
                            _.each(req.session.cart.items, function(art) {
                                art.id = req.session.passport.user.id;
                                Cart.save(art, function(cartrespo) {
                                    i++;
                                    if (i == req.session.cart.items.length) {
                                        req.session.cart = {};
                                        res.send(frontend);
                                    }
                                });
                            });
                        } else {
                            res.send(frontend);
                        }
                    } else {
                        res.json(data);
                    }
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
    findCust: function(req, res) {
        if (req.body) {
            if (req.body.search && req.body.search != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.findCust(req.body, print);
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
    }
};
