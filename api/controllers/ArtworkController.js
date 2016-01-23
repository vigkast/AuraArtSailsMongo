/**
 * ArtworkController
 *
 * @description :: Server-side logic for managing Artwork
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  save: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        if (req.body._id) {
          if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            artwork();
          } else {
            res.json({
              value: false,
              comment: "Artwork-id is incorrect"
            });
          }
        } else {
          artwork();
        }
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }

      function artwork() {
        var print = function(data) {
          res.json(data);
        }
        Artwork.save(req.body, print);
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  saveFront: function(req, res) {
    if (req.body) {
      if (req.session.passport) {
        req.body.selleremail = req.session.passport.user.email;
        req.body.sellername = req.session.passport.user.name;
        artwork();
      } else {
        res.json({
          value: false,
          comment: "User not logged in"
        });
      }

      function artwork() {
        var print = function(data) {
          res.json(data);
        }
        Artwork.saveFront(req.body, print);
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  delete: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          var print = function(data) {
            res.json(data);
          }
          Artwork.delete(req.body, print);
        } else {
          res.json({
            value: false,
            comment: "Artwork-id is incorrect"
          });
        }
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  find: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        function callback(data) {
          res.json(data);
        };
        Artwork.find(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findbyid: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function(data) {
          res.json(data);
        }
        Artwork.findbyid(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Artwork-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findall: function(req, res) {
    if (req.body) {
      function callback(data) {
        res.json(data);
      };
      Artwork.findall(req.body, callback);
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findlimited: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
          function callback(data) {
            res.json(data);
          };
          Artwork.findlimited(req.body, callback);
        } else {
          res.json({
            value: false,
            comment: "Please provide parameters"
          });
        }
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findlimitedout: function(req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Artwork.findlimitedout(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findone: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          var print = function(data) {
            res.json(data);
          }
          Artwork.findone(req.body, print);
        } else {
          res.json({
            value: false,
            comment: "Artwork-id is incorrect"
          });
        }
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  localtoserver: function(req, res) {
    function callback(data) {
      res.json(data);
    };
    Artwork.localtoserver(req.body, callback);
  },
  servertolocal: function(req, res) {
    function callback(data) {
      res.json(data);
    };
    Artwork.servertolocal(req.body, callback);
  },
  deleteout: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          var print = function(data) {
            res.json(data);
          }
          Artwork.deleteout(req.body, print);
        } else {
          res.json({
            value: false,
            comment: "Artwork-id is incorrect"
          });
        }
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  lastsr: function(req, res) {
    if (req.body) {
      function callback(data) {
        res.json(data);
      };
      Artwork.lastsr(req.body, callback);
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  artworktype: function(req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Artwork.artworktype(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  favoriteartwork: function(req, res) {
    if (req.body) {
      if (req.body.artwork && req.body.artwork.length > 0) {
        function callback(data) {
          res.json(data);
        };
        Artwork.favoriteartwork(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  searchartwork: function(req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Artwork.searchartwork(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  searchdrop: function(req, res) {
    if (req.body) {
      if (req.body.search && req.body.search != "") {
        function callback(data) {
          res.json(data);
        };
        Artwork.searchdrop(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  nextartwork: function(req, res) {
    if (req.body) {
      if (req.body.srno && req.body.srno != "" && req.body.type && req.body.type != "") {
        function callback(data) {
          res.json(data);
        };
        Artwork.nextartwork(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findMyArtwork: function(req, res) {
    if (req.body) {
      if (req.session.passport && req.session.passport.user) {
        req.body.user = req.session.passport.user.id;

        function callback(data) {
          res.json(data);
        };
        Artwork.findMyArtwork(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "user-id is incorrect "
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  }
};
