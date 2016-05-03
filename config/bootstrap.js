/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
    sails.Db = require('mongodb').Db,
        sails.MongoClient = require('mongodb').MongoClient,
        sails.ISODate = require('mongodb').ISODate,
        sails.Server = require('mongodb').Server,
        sails.ReplSetServers = require('mongodb').ReplSetServers,
        sails.ObjectID = require('mongodb').ObjectID,
        sails.Binary = require('mongodb').Binary,
        sails.GridStore = require('mongodb').GridStore,
        sails.Grid = require('mongodb').Grid,
        sails.Code = require('mongodb').Code,
        sails.assert = require('assert'),
        sails.moment = require('moment'),
        sails.fs = require('fs'),
        sails.sizeOf = require('image-size'),
        sails.mime = require('mime'),
        sails.xlsxj = require("xlsx-to-json"),
        sails.json2xls = require('json2xls'),
        sails.sha512 = require('sha512'),
        sails.md5 = require('MD5'),
        sails.webshot = require('webshot'),
        sails._ = require('lodash'),
        sails.request = require('request'),
        sails.lwip = require('lwip'),
        sails.myurl = "http://www.auraart.in/",
        sails.PDFImagePack = require("pdf-image-pack"),
        sails.fromEmail = "rishiraj@auraart.in",
        sails.fromName = "Aura-Art",
        sails.css = "body {margin:0}.furniture-holder img,.painting-holder img{vertical-align:bottom}.wall-builder{height:500px;width:665px;margin: 0 auto;padding-right:330px;width:100%}.height-holder{height:500px;width: 665px;position:relative;min-height:100%;height:100%;overflow: hidden;}.dim{position:absolute;color:#000;font-size:13px}.dim.dim-h{height:100%;top:0;left:-5px;-webkit-transform:translate(-100%,0);display:flex;display:-webkit-flex;align-items:center;-webkit-align-items:center}.dim.dim-h:after{top:5px}.dim.dim-h:before{bottom:5px}.dim.dim-h.light:after,.dim.dim-h.light:before{background-color:#ddd}.dim.dim-h:after,.dim.dim-h:before{position:absolute;content:'';left:50%;background-color:#000;height:calc(40%);width:1px}.dim.dim-w{top:-25px;left:0;width:100%;text-align:center}.dim.dim-w:after,.dim.dim-w:before{top:50%;}.dim.dim-w:after{left:5px}.dim.dim-w:before{right:5px}.dim.dim-w.light:after,.dim.dim-w.light:before{background-color:#ddd}.dim.dim-w:after,.dim.dim-w:before{position:absolute;content:'';height:1px;background-color:#000;width:44%}.abs{color:#ddd;position:absolute;font-size:20px}.abs.blacke{color:#000}.abs.l-tb{left:50%;-webkit-transform:translateX(-50%);line-height:0}.abs.righted{right:0}.abs.lefted{left:0}.abs.toped{top:-5px}.abs.bottomed{bottom:-5px}.over-flowing{overflow:hidden;position:relative;min-height:100%;width:100%;height:100%}.furniture-holder,.painting-holder,.wall-image{position:absolute}.wall-image{left:0;top:0;height:100%;width:100%;background-repeat:no-repeat;background-position:50% 50%;background-size:100% auto;cursor:move}.painting-holder{height:auto;width:auto;left:30%;top:52px;box-shadow:0 1px 4px rgba(0,0,0,.5);cursor:move;z-index:9}.abs.t-rl{top:0;}",

        // Connection URL
        sails.url = 'mongodb://localhost:27017/auraart';
    sails.query = function(myfunc) {
        sails.MongoClient.connect(sails.url, myfunc);
    };
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
