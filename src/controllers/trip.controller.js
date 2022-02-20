'use strict'
/* ---------------TRIP---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')

const customAlphabet = require('nanoid').customAlphabet
const rand_letters = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ', 4)

exports.list_all_trips = function (req, res) {
  Trip.find({ isDeleted: false }, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_my_trips = function (req, res) {
  Trip.find({}, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.create_a_trip = function (req, res) {
  const newTrip = new Trip(req.body)
  newTrip.ticker = tickerGenerator()
  newTrip.price = priceGenerator(newTrip.stages)
  newTrip.save(function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

function tickerGenerator() {
  const date = new Date
  const year = date.getFullYear().toString().substr(-2)
  const res = year + (date.getMonth() + 1).toString() + date.getDate().toString() + "-" + rand_letters()
  return res
}

function priceGenerator(stages) {
  var res = 0;

  stages.forEach(st => {
    res = st.price + res;
  });

  return res;
}

exports.search_trips = function (req, res) {
  const query = {}
  query.title = req.query.tripName != null ? req.query.tripName : /.*/

  if (req.query.deleted) {
    query.deleted = req.query.deleted
  }
  let skip = 0
  if (req.query.startFrom) {
    skip = parseInt(req.query.startFrom)
  }
  let limit = 0
  if (req.query.pageSize) {
    limit = parseInt(req.query.pageSize)
  }
  let sort = ''
  if (req.query.reverse === 'true') {
    sort = '-'
  }
  if (req.query.sortedBy) {
    sort += req.query.sortedBy
  }

  console.log('Query: ' + query + ' Skip:' + skip + ' Limit:' + limit + ' Sort:' + sort)

  Trip.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, trip) {
      console.log('Start searching trips')
      if (err) {
        res.send(err)
      } else {
        res.json(trip)
      }
      console.log('End searching trip')
    })
}

exports.read_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (!trip) {
      res.status(404).send('Non existing trip')
    } else {
      if (err) {
        res.send(err)
      } else {
        res.json(trip)
      }
    }
  })
}

exports.update_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (!trip) {
      res.status(404).send('Non existing trip')
    } else {
      if (err) {
        res.send(err)
      } else {
        if (!trip.draftMode) {
          res.status(403).send('You cannot update a published trip')
        } else {
          Trip.findOneAndUpdate({ _id: req.params.tripId, draftMode: true }, req.body, { new: true }, function (err, trip) {
            if (err) {
              if (err.name === 'ValidationError') {
                res.status(422).send(err)
              } else {
                res.status(500).send(err)
              }
            } else {
              res.json(trip)
            }
          })
        }
      }
    }
  })
    
}

exports.cancel_a_trip = function (req, res) {
  const reason = req.body.reasonCancel
  if (!reason.replace(/\s/g, "")) {
    res.status(422).send('A cancellation reason is needed')
  } else {
    // Need no application accepted validation
    Trip.findOneAndUpdate({ _id: req.params.tripId, dateStart: { $gt: Date.now() } }, { isCancelled: true, reasonCancel: reason }, { new: true }, function (err, trip) {
      if (!trip) {
        res.status(404).send('Non existing trip')
      } else {
        if (err) {
          if (err.name === 'ValidationError') {
            res.status(422).send(err)
          } else {
            res.status(500).send(err)
          }
        } else {
          res.json(trip)
        }
      }
    })
  }
}

exports.delete_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (!trip) {
      res.status(404).send('Non existing trip')
    } else {
      if (err) {
        res.send(err)
      } else {
        console.log(trip)
        if (!trip.draftMode) {
          res.status(403).send('You cannot delete a published trip')
        } else {
          Trip.findOneAndUpdate({ _id: req.params.tripId, draftMode: true }, { isDeleted: true }, { new: true }, function (err, trip) {
            if (err) {
              if (err.name === 'ValidationError') {
                res.status(422).send(err)
              } else {
                res.status(500).send(err)
              }
            } else {
              res.json(trip)
            }
          })
        }
      }
    }
  })
}

/* ---------------STAGE---------------------- */
const Stage = mongoose.model('Stages')

exports.create_a_stage = function (req, res) {
  const newStage = new Stage(req.body)
  newStage.save(function (err, stage) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(stage)
    }
  })
}

exports.read_a_stage = function (req, res) {
  Stage.findById(req.params.categId, function (err, stage) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(stage)
    }
  })
}