/**
 * TicketelementController
 *
 * @description :: Server-side logic for managing Ticketelement
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.find(req.body, callback);

    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.findlimited(req.body, callback);

    },
    findOne: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.findOne(req.body, callback);
    },
    localtoserver: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.localtoserver(req.body, callback);
    },
    servertolocal: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Ticketelement.servertolocal(req.body, callback);
    }
};