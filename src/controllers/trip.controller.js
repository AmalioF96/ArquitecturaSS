'use strict'
/* ---------------TRIP---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const authController = require('./authController')
const admin = require('firebase-admin')

exports.list_all_trips = function (req, res) {
  Trip.find({ isDeleted: false, draftMode: false }, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

//v2
exports.list_my_trips = async function (req, res) {
  const idToken = req.headers.idtoken
  console.log('idToken: ' + idToken)
  const managerId = await authController.getUserId(idToken)
  console.log('managerId: ' + managerId)
  Trip.find({ isDeleted: false, manager: managerId }, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.create_a_trip = function (req, res) {
  const newTrip = new Trip(req.body)
  newTrip.save(function (err, trip) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

//v2
exports.create_a_trip_verified = async function (req, res) {
  const newTrip = new Trip(req.body)
  const idToken = req.headers.idtoken
  console.log('idToken: ' + idToken)
  const managerId = await authController.getUserId(idToken)
  console.log('managerId: ' + managerId)
  newTrip.manager = managerId
  newTrip.save(function (err, trip) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}


exports.search_trips = function (req, res) {
  const query = {}
  query.text = req.query.text != null ? req.query.text : /.*/

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

  console.log('Query: ' + query + ' Skip:' + skip + ' Limit:' + limit)

  Trip.find({ $text: { $search: query.text }, isDeleted: query.deleted }, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
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
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    }
    else {
      res.json(trip)
    }
  })
}

exports.update_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!trip.draftMode) {
      res.status(403).send('You cannot update a published trip')
    }
    else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
          if (err.name === 'ValidationError') {
            res.status(422).send(err)
          } else {
            res.status(500).send(err)
          }
        } else if (!trip) {
          res.status(404).send('Non existing trip')
        }
        else {
          res.json(trip)
        }
      })
    }
  })
}

//v2
exports.update_a_trip_verified = function (req, res) {
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!trip.draftMode) {
      res.status(403).send('You cannot update a published trip')
    }
    else {
      const tripManagerId = trip.manager
      console.log('tripManagerId: ' + tripManagerId)
      const idToken = req.headers.idtoken
      console.log('idToken: ' + idToken)
      const managerId = await authController.getUserId(idToken)
      console.log('managerId: ' + managerId)
      console.log(JSON.stringify(tripManagerId) === JSON.stringify(managerId))
      if (JSON.stringify(tripManagerId) !== JSON.stringify(managerId)) {
        res.status(403).send('You cannot update a trip that is not yours')
      } else {
        Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
          if (err) {
            if (err.name === 'ValidationError') {
              res.status(422).send(err)
            } else {
              res.status(500).send(err)
            }
          } else if (!trip) {
            res.status(404).send('Non existing trip')
          }
          else {
            res.json(trip)
          }
        })
      }
    }
  })
}

exports.cancel_a_trip = function (req, res) {
  const reason = req.body.reasonCancel
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      res.status(500).send(err)
    }
    else if (!trip) {
      res.status(404).send('Non existing trip')
    }
    else if (!(new Date(trip.dateStart) > new Date)) {
      res.status(403).send('Cannot cancel already started trips')
    }
    else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, { isCancelled: true, reasonCancel: reason }, { new: true }, function (err, trip) {
        if (err) {
          if (err.name === 'ValidationError') {
            res.status(422).send(err)
          } else if (err === 'A cancellation reason is needed') {
            res.status(403).send(err)
          } else if (err === 'Cannot cancel with accepted applications') {
            res.status(403).send(err)
          } else {
            res.status(500).send(err)
          }
        } else if (!trip) {
          res.status(404).send('Non existing trip')
        } else {
          res.json(trip)
        }
      })
    }
  })
}

//v2
exports.cancel_a_trip_verified = function (req, res) {
  const reason = req.body.reasonCancel
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    }
    else if (!(new Date(trip.dateStart) > new Date)) {
      res.status(403).send('Cannot cancel already started trips')
    }
    else {
      const tripManagerId = trip.manager
      console.log('tripManagerId: ' + tripManagerId)
      const idToken = req.headers.idtoken
      console.log('idToken: ' + idToken)
      const managerId = await authController.getUserId(idToken)
      console.log('managerId: ' + managerId)
      console.log(JSON.stringify(tripManagerId) === JSON.stringify(managerId))
      if (JSON.stringify(tripManagerId) !== JSON.stringify(managerId)) {
        res.status(403).send('You cannot cancel a trip that is not yours')
      } else {
        Trip.findOneAndUpdate({ _id: req.params.tripId }, { isCancelled: true, reasonCancel: reason }, { new: true }, function (err, trip) {
          if (err) {
            if (err.name === 'ValidationError') {
              res.status(422).send(err)
            } else if (err === 'A cancellation reason is needed') {
              res.status(403).send(err)
            } else if (err === 'Cannot cancel with accepted applications') {
              res.status(403).send(err)
            } else {
              res.status(500).send(err)
            }
          } else if (!trip) {
            res.status(404).send('Non existing trip')
          } else {
            res.json(trip)
          }
        })
      }
    }
  })
}

exports.delete_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!trip.draftMode) {
      res.status(403).send('You cannot delete a published trip')
    }
    else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, { isDeleted: true }, { new: true }, function (err, trip) {
        if (err) {
          if (err.name === 'ValidationError') {
            res.status(422).send(err)
          } else {
            res.status(500).send(err)
          }
        } else if (!trip) {
          res.status(404).send('Non existing trip')
        } else {
          res.json(trip)
        }

      })
    }
  })
}

//v2
exports.delete_a_trip_verified = function (req, res) {
  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!trip.draftMode) {
      res.status(403).send('You cannot delete a published trip')
    }
    else {
      const tripManagerId = trip.manager
      console.log('tripManagerId: ' + tripManagerId)
      const idToken = req.headers.idtoken
      console.log('idToken: ' + idToken)
      const managerId = await authController.getUserId(idToken)
      console.log('managerId: ' + managerId)
      console.log(JSON.stringify(tripManagerId) === JSON.stringify(managerId))
      if (JSON.stringify(tripManagerId) !== JSON.stringify(managerId)) {
        res.status(403).send('You cannot delete a trip that is not yours')
      } else {
        Trip.findOneAndUpdate({ _id: req.params.tripId }, { isDeleted: true }, { new: true }, function (err, trip) {
          if (err) {
            if (err.name === 'ValidationError') {
              res.status(422).send(err)
            } else {
              res.status(500).send(err)
            }
          } else if (!trip) {
            res.status(404).send('Non existing trip')
          } else {
            res.json(trip)
          }

        })
      }
    }
  })
}
