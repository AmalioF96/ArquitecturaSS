"use strict";
/* ---------------ACTOR---------------------- */
const mongoose = require("mongoose");
const Finder = mongoose.model("Finders");

exports.list_all_finders = function (req, res) {
  Finder.find({}, function (err, finders) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(finders);
    }
  });
};

exports.create_an_finder = function (req, res) {
  const newFinder = new Finder({...req.body, searchTime:new Date()});

  //newFinder = {...newFinder, searchTime:new Date()};

  console.info(newFinder);
  

  newFinder.save(function (err, finder) {
    if (err) {
      if (err.name === "ValidationError") {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else {
      res.status(201).json(finder);
    }
  });
};

exports.read_an_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(finder);
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
        if (err.name === "ValidationError") {
          res.status(422).send(err);
        } else {
          res.status(500).send(err);
        }
      } else {
        res.status(200).json(finder);
      }
    }
  );
};

exports.delete_an_finder = function (req, res) {
  Finder.deleteOne({ _id: req.params.finderId }, function (err, finder) {
    console.log(finder);
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else if (!finder) {
      res.status(404).send('Non existing finder')
    } else {
      res.json(finder)
    }

  })
};
