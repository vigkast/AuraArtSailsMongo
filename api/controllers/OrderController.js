/**
 * OrderController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  save: function(req, res) {
    if (req.body) {
      if (req.session.passport) {
        req.body._id = req.session.passport.user.id;
      } else {
        Order.saveGuest(req.body, function(orderRespo) {
          res.json(data);
        });
      }
        User.findone(req.body, function(respo) {
          respo.user = respo._id;
          respo.packing = req.body.packing;
          respo.vat = req.body.vat;
          respo.grantTotal = req.body.grantTotal;
          respo.subTotal = req.body.subTotal;
          respo.comment = req.body.comment;
          respo.cart = req.body.cart;
          delete respo._id;
          Order.save(respo, function(data2) {
            res.json(data2);
          });
        });
    } else {
      res.json({
        value: "false",
        comment: "Please provide parameters"
      });
    }
  },
  delete: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function(data) {
          res.json(data);
        }
        Order.delete(req.body, print);
      } else {
        res.json({
          value: "false",
          comment: "Order-id is incorrect"
        });
      }
    } else {
      res.json({
        value: "false",
        comment: "Please provide parameters"
      });
    }
  },
  find: function(req, res) {
    var print = function(data) {
      res.json(data);
    }
    Order.find(req.body, print);
  },
  findOrders: function(req, res) {
    if (req.session.passport) {
      req.body.user = req.session.passport.user.id;
      var print = function(data) {
        res.json(data);
      }
      Order.findOrders(req.body, print);
    } else {
      res.json([]);
    }
  },
  findone: function(req, res) {
      if (req.body) {
          if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
              var print = function(data) {
                  res.json(data);
              }
              Order.findone(req.body, print);
          } else {
              res.json({
                  value: "false",
                  comment: "Slider-id is incorrect"
              });
          }
      } else {
          res.json({
              value: "false",
              comment: "Please provide parameters"
          });
      }
  },
  findlimited: function(req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Order.findlimited(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: "false",
        comment: "Please provide parameters"
      });
    }
  }
};
