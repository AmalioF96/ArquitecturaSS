"use strict";
/* ---------------ACTOR---------------------- */
const mongoose = require("mongoose");
const Finder = mongoose.model("Finders");

exports.list_all_finders = function (req, res) {
  Finder.find({}, function (err, finders) {
    if (err) {
      res.send(err);
    } else {
      res.json(finders);
    }
  });
};

exports.create_an_finder = function (req, res) {
  const newFinder = new Finder(req.body);
  console.info(req.body);
  console.info(newFinder);

  /** TODO
   * Comprobar que el usuario es explorer
   */

  newFinder.save(function (err, finder) {
    if (err) {
      res.send(err);
    } else {
      res.json(finder);
    }
  });
};

exports.read_an_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.send(err);
    } else {
      res.json(finder);
    }
  });
};

exports.update_an_finder = function (req, res) {
  Finder.findOneAndUpdate(
    { _id: req.params.finderId },
    req.body,
    { new: true },
    function (err, finder) {
      if (err) {
        res.send(err);
      } else {
        res.json(finder);
      }
    }
  );
};

exports.delete_an_finder = function (req, res) {
  res.send("ERROR");
};
