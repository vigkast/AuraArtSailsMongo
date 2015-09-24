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
    findone: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.findone(req.body, callback);
    },
    findevents: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Event.findevents(req.body, callback);
    }
};