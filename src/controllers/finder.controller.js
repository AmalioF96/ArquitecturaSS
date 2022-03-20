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
 * @param {*} req
 * @param {*} res
 */
exports.find_trips = function (req, res) {
  Config.findOne(function (err, config) {
    
    //Set the basic values of the query
    var consulta_cache = {
      explorer: ObjectId(req.body.explorer),

      searchTime: {
        $gte: new Date(
          new Date().getTime() - 1000 * 60 * 60 * config.finderCache
        ),
      },
    };
    //console.log(consulta_cache);
    //Check request parameters
    var valid_query = false;

    if (req.body.keyword) {
      consulta_cache["keyword"] = req.body.keyword;
      valid_query = true;
    }
    if (req.body.priceMin) {
      consulta_cache["priceMin"] = req.body.priceMin;
      valid_query = true;
    }
    if (req.body.priceMax) {
      consulta_cache["priceMax"] = req.body.priceMax;
      valid_query = true;
    }
    if (req.body.dateStart) {
      consulta_cache["dateStart"] = req.body.dateStart;
      valid_query = true;
    }
    if (req.body.dateEnd) {
      consulta_cache["dateEnd"] = req.body.dateEnd;
      valid_query = true;
    }

    if (err) {
      res.status(500).send(err);
    } else if (!valid_query) {
      res.status(400).send("Debe introducir algun parametro de entrada");
    } else {

      Finder.findOne(consulta_cache)
        .sort({ searchTime: -1 })
        .exec(function (err, finder) {
          //console.log(finder);

          if (err) {
            res.status(500).send(err);
          } else if (!finder) {
            // Prepare trip search
            var consulta_trips = {
              $and: [],
            };

            if (req.body.keyword) {
              consulta_trips["$and"].push({
                $or: [
                  {
                    description: { $regex: req.body.keyword, $options: "i" },
                  },
                  {
                    title: { $regex: req.body.keyword, $options: "i" },
                  },
                  {
                    ticker: { $regex: req.body.keyword, $options: "i" },
                  },
                ],
              });
            }

            if (req.body.priceMin) {
              consulta_trips["$and"].push({
                price: { $gte: req.body.priceMin },
              });
            }
            if (req.body.priceMax) {
              consulta_trips["$and"].push({
                price: { $lte: req.body.priceMax },
              });
            }
            if (req.body.dateStart) {
              consulta_trips["$and"].push({
                dateStart: { $gte: req.body.dateStart },
              });
            }
            if (req.body.dateEnd) {
              consulta_trips["$and"].push({
                dateEnd: { $lte: req.body.dateEnd },
              });
            }

            Trip.find(consulta_trips, function (err, viajes) {
              //console.log(viajes);
              if (err) {
                res.status(500).send(err);
              } else {
                const newFinder = new Finder({
                  ...req.body,
                  searchTime: new Date(),
                  trips: viajes,
                });

               // console.info(newFinder);
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
              }
            });
          } else {
            res.status(200).json(finder);
          }
        });
    }
  });
};
