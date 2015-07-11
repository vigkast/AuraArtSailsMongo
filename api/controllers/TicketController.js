/**
 * TicketController
 *
 * @description :: Server-side logic for managing Ticket
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Ticket.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Ticket.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Ticket.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Ticket.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Ticket.delete(req.body, print);
    },
    countticket: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Ticket.countticket(req.body, print);
    }
};