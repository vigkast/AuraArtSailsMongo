/**
 * HtmlmetadataController
 *
 * @description :: Server-side logic for managing Htmlmetadata
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.find(req.body, callback);

    },
    findall: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.findall(req.body, callback);

    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.findlimited(req.body, callback);

    },
    findOne: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.findOne(req.body, callback);
    },
    localtoserver: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.localtoserver(req.body, callback);
    },
    servertolocal: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Htmlmetadata.servertolocal(req.body, callback);
    }
};