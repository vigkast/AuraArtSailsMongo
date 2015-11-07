/**
 * SliderController
 *
 * @description :: Server-side logic for managing Slider
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Slider.save(req.body, print);
    },
    find: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Slider.find(req.body, print);
    },
    findlimited: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Slider.findlimited(req.body, print);
    },
    findone: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Slider.findone(req.body, print);
    },
    delete: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Slider.delete(req.body, print);
    }
};
