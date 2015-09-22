/**
 * EventController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.find(req.body, callback);

    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.findlimited(req.body, callback);

    },
    findOne: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.findOne(req.body, callback);
    }
};

