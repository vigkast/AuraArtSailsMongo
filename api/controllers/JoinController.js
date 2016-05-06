/**
 * JoinController
 *
 * @description :: Server-side logic for managing Joins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
                                found.artwork.size = found.artwork.height + " X " + found.artwork.width + " inches";
                            } else {
                                found.artwork.size = found.artwork.height + " X " + found.artwork.width + " X " + found.artwork.breadth + " inches";
                            }
                            if (found.artwork.fstatus && found.artwork.fstatus != "rolled" && found.artwork.fstatus != "stretched") {
                                found.artwork.sizewithframe = found.artwork.framedheight + " X " + found.artwork.framedwidth + " inches";
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
    }
};
