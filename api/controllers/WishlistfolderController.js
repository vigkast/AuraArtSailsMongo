/**
 * WishlistfolderController
 *
 * @description :: Server-side logic for managing Wishlistfolder
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.find(req.body, callback);

    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.findlimited(req.body, callback);

    },
    findOne: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.findOne(req.body, callback);
    },
    accessfolder: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.accessfolder(req.body, callback);
    },
    localtoserver: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.localtoserver(req.body, callback);
    },
    servertolocal: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Wishlistfolder.servertolocal(req.body, callback);
    }
};