"use strict";
/* ---------------ACTOR---------------------- */
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
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
  const newFinder = new Finder({ ...req.body, searchTime: new Date() });

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
      if (err.name === "ValidationError") {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    } else if (!finder) {
      res.status(404).send("Non existing finder");
    } else {
      res.json(finder);
    }
  });
};

const Trip = mongoose.model("Trips");
const Config = mongoose.model("Configs");
/**
 * TODO Me queda hacer que los parametros sean opcionales, luego que sino encuentra nada busque en Trips con los parametros adecuados y guarde los trips en finder
 * @param {*} req 
 * @param {*} res 
 */
exports.find_trips = function (req, res) {
  Config.findOne(function (err, config) {
    console.log(config);

    console.log(config.finderCache);
    console.log(config.finderResults);

    var consulta_cache = {
      keyword: req.body.keyword,
      priceMin: req.body.priceMin,
      priceMax: req.body.priceMax,
      dateStart: new Date(req.body.dateStart),
      dateEnd: new Date(req.body.dateEnd),
      explorer: ObjectId(req.body.explorer),
      searchTime: {
        $lte: new Date(),
      },
      searchTime: {
        $gte: new Date(
          new Date().getTime() - 1000 * 60 * 60 * config.finderCache
        ),
      },
    };

    Finder.findOne(consulta_cache)
      .sort({ searchTime: -1 })
      .exec(function (err, finders) {
        console.log(finders);

        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(finders);
        }
      });
  });
};
