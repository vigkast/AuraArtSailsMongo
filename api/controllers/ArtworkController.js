/**
 * ArtworkController
 *
 * @description :: Server-side logic for managing Artwork
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.find(req.body, callback);

    },
    findbyid: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.findbyid(req.body, callback);

    },
    findall: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.findall(req.body, callback);

    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.findlimited(req.body, callback);

    },
    findlimitedout: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.findlimitedout(req.body, callback);

    },
    findone: function (req, res) {
        
        function callback(data) {
            res.json(data);
        };
        Artwork.findone(req.body, callback);
    },
    localtoserver: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.localtoserver(req.body, callback);
    },
    servertolocal: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.servertolocal(req.body, callback);
    },
    findhome: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.findhome(req.body, callback);
    },
    deleteout: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Artwork.deleteout(req.body, callback);
    }
};