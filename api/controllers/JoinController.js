/**
 * JoinController
 *
 * @description :: Server-side logic for managing Joins
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
                        comment: "Join-id is incorrect"
                    });
                }
            } else {
                user();
            }

            function user() {
                var print = function(data) {
                    res.json(data);
                }
                Join.save(req.body, print);
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
                Join.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Join-id is incorrect"
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
        Join.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Join.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Join-id is incorrect"
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
                Join.findlimited(req.body, callback);
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
    excelDownload: function(req, res) {
        var arr = [];
        var i = 0;
        if (req.query && req.query._id && req.query._id != "") {
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false
                    });
                } else {
                    db.collection("user").aggregate([{
                        $match: {
                            _id: sails.ObjectID(req.query._id),
                            accesslevel: "artist"
                        }
                    }, {
                        $unwind: "$artwork"
                    }, {
                        $match: {
                            "artwork.status": "approve"
                        }
                    }, {
                        $project: {
                            _id: 0,
                            name: 1,
                            "artwork.name": 1,
                            "artwork.type": 1,
                            "artwork.subtype": 1,
                            "artwork.imageno": 1,
                            "artwork.art": 1,
                            "artwork.height": 1,
                            "artwork.width": 1,
                            "artwork.breadth": 1,
                            "artwork.weight": 1,
                            "artwork.yoc": 1,
                            "artwork.area": 1,
                            "artwork.fstatus": 1,
                            "artwork.framedheight": 1,
                            "artwork.framedwidth": 1,
                            "artwork.gprice": 1,
                            "artwork.pricesq": 1,
                            "artwork.price": 1,
                            "artwork.address": 1,
                            "artwork.dim": 1
                        }
                    }]).each(function(err, found) {
                        if (_.isEmpty(found)) {
                            var xls = sails.json2xls(arr);
                            var path = './' + arr[0]["Name of Artist"] + '.xlsx';
                            sails.fs.writeFileSync(path, xls, 'binary');
                            var excel = sails.fs.readFileSync(path);
                            var mimetype = sails.mime.lookup(path);
                            res.set('Content-Type', "application/octet-stream");
                            res.set('Content-Disposition', "attachment;filename=" + path);
                            res.send(excel);
                            setTimeout(function() {
                                sails.fs.unlink(path, function(err) {
                                    console.log(err);
                                });
                            }, 30000);
                            db.close();
                        } else if (err) {
                            console.log(err);
                        } else {
                            if (found.artwork.subtype && found.artwork.subtype.length > 0) {
                                var medium = '';
                                _.each(found.artwork.subtype, function(abc) {
                                    medium += abc.name + ",";
                                });
                                medium = medium.substring(0, medium.length - 1);
                                found.artwork.subtype = medium;
                            }
                            if (found.artwork.type != "Sculptures") {
                                found.artwork.breadth = "";
                                found.artwork.size = found.artwork.height + " x " + found.artwork.width + " inches";
                            } else {
                                found.artwork.size = found.artwork.height + " x " + found.artwork.width + " x " + found.artwork.breadth + " inches";
                            }
                            if (found.artwork.fstatus && found.artwork.fstatus != "rolled" && found.artwork.fstatus != "stretched") {
                                found.artwork.sizewithframe = found.artwork.framedheight + " x " + found.artwork.framedwidth + " inches";
                            } else {
                                found.artwork.sizewithframe = "";
                            }
                            if (!found.artwork.art || found.artwork.art == "") {
                                found.artwork.art = "Consigned";
                            }
                            if (!found.artwork.dim || found.artwork.dim == "") {
                                found.artwork.dim = "";
                            }
                            if (!found.artwork.address || found.artwork.address == "") {
                                found.artwork.address = "";
                            } else {
                                found.artwork.address = sails._.capitalize(found.artwork.address);
                            }
                            found.artwork.artistname = found.name;
                            delete found.name;
                            i++;
                            arr.push({
                                "Sr No": i,
                                "Name of Artist": found.artwork.artistname,
                                "Image No": found.artwork.imageno,
                                "Owned/Consigned": found.artwork.art,
                                "Title": found.artwork.name,
                                "Medium": found.artwork.subtype,
                                "Size in Inches": found.artwork.size,
                                "Height (inches)": found.artwork.height,
                                "Width (inches)": found.artwork.width,
                                "Depth (inches)": found.artwork.breadth,
                                "Weight (kgs)": found.artwork.weight,
                                "Area in square feet / Volume in cubic feet": found.artwork.area,
                                "Size in Inches with frame": found.artwork.sizewithframe,
                                "Year of Creation": found.artwork.yoc,
                                "Gallery Price, excl VAT (Rs)": found.artwork.gprice,
                                "Gallery Price per square feet": found.artwork.pricesq,
                                "Artist Price (Rs)": found.artwork.price,
                                "Location": found.artwork.address,
                                "Remarks": found.artwork.dim
                            });
                        }
                    });
                }
            });
        } else {
            res.json({
                value: false,
                comment: "Invalid Id"
            });
        }
    },
    downloadUser: function(req, res) {
        var abc = [];
        var i = 0;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    comment: "Error"
                });
            } else {
                db.collection("user").find({
                    $or: [{
                        accesslevel: "customer"
                    }, {
                        accesslevel: "reseller"
                    }]
                }).sort({
                    name: 1
                }).each(function(err, found) {
                    if (_.isEmpty(found)) {
                        var xls = sails.json2xls(abc);
                        var path = './Login-List.xlsx';
                        sails.fs.writeFileSync(path, xls, 'binary');
                        var excel = sails.fs.readFileSync(path);
                        var mimetype = sails.mime.lookup(path);
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(excel);
                        setTimeout(function() {
                            sails.fs.unlink(path, function(err) {
                                console.log(err);
                            });
                        }, 30000);
                        // res.json(abc);
                        db.close();
                    } else if (err) {
                        console.log(err);
                        db.close();
                    } else {
                        i++;
                        var regadd = "";
                        var obj = {};
                        obj = {
                            "Sr No": i,
                            "Name": found.name,
                            "Email-Id": found.email
                        };
                        if (found.mob) {
                            obj["Mobile Number"] = found.mob;
                        } else {
                            obj["Mobile Number"] = "";
                        }
                        if (found.dob) {
                            obj["Date Of Birth"] = found.dob;
                        } else {
                            obj["Date Of Birth"] = "";
                        }
                        if (found.gender) {
                            obj["Gender"] = sails._.capitalize(found.gender);
                        } else {
                            obj["Gender"] = "";
                        }
                        if (found.billing && found.billing.bldgname) {
                            regadd = found.billing.flatno + ", " + found.billing.bldgname + ", " + found.billing.street + ", " + found.billing.locality + ", " + found.billing.landmark + ", " + found.billing.city + ", " + found.billing.state;
                            if (found.billing.pincode) {
                                regadd += ", " + found.billing.pincode.toString();
                            }
                            if (found.billing.country) {
                                regadd += ", " + found.billing.country;
                            }
                            obj["Registered Address"] = regadd;
                        } else {
                            obj["Registered Address"] = "";
                        }
                        if (found.fbid) {
                            obj["Facebook"] = found.fbid;
                            obj["Google"] = "";
                            obj["Twitter"] = "";
                        } else if (found.googleid) {
                            obj["Facebook"] = "";
                            obj["Google"] = found.googleid;
                            obj["Twitter"] = "";
                        } else if (found.tweetid) {
                            obj["Facebook"] = "";
                            obj["Google"] = "";
                            obj["Twitter"] = found.tweetid;
                        } else {
                            obj["Facebook"] = "";
                            obj["Google"] = "";
                            obj["Twitter"] = "";
                        }
                        if (found.bank) {
                            if (found.bank.holderName) {
                                obj["Name of Account Holder"] = found.bank.holderName;
                            } else {
                                obj["Name of Account Holder"] = "";
                            }
                            if (found.bank.holderAdd) {
                                obj["Address of Account Holder"] = found.bank.holderAdd;
                            } else {
                                obj["Address of Account Holder"] = "";
                            }
                            if (found.bank.accountType) {
                                obj["Type of Account"] = found.bank.accountType;
                            } else {
                                obj["Type of Account"] = "";
                            }
                            if (found.bank.accountNumber) {
                                obj["Account Number"] = found.bank.accountNumber;
                            } else {
                                obj["Account Number"] = "";
                            }
                            if (found.bank.bankName) {
                                obj["Name of bank"] = found.bank.bankName;
                            } else {
                                obj["Name of bank"] = "";
                            }
                            if (found.bank.ifsc) {
                                obj["IFSC Code"] = found.bank.ifsc;
                            } else {
                                obj["IFSC Code"] = "";
                            }
                            if (found.bank.branchAdd) {
                                obj["Bank Branch Address"] = found.bank.branchAdd;
                            } else {
                                obj["Bank Branch Address"] = "";
                            }
                        } else {
                            obj["Name of Account Holder"] = "";
                            obj["Address of Account Holder"] = "";
                            obj["Type of Account"] = "";
                            obj["Account Number"] = "";
                            obj["Name of bank"] = "";
                            obj["IFSC Code"] = "";
                            obj["Bank Branch Address"] = "";
                        }
                        abc.push(obj);
                    }
                });
            }
        });
    },
    downloadJoin: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    comment: "Error"
                });
            } else {
                Join.find({}, function(respo) {
                    if (respo.value != false) {
                        var xls = sails.json2xls(respo);
                        var path = './Mailing-List.xlsx';
                        sails.fs.writeFileSync(path, xls, 'binary');
                        var excel = sails.fs.readFileSync(path);
                        var mimetype = sails.mime.lookup(path);
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(excel);
                        setTimeout(function() {
                            sails.fs.unlink(path, function(err) {
                                console.log(err);
                            });
                        }, 30000);
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
