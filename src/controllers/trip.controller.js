'use strict'
/* ---------------TRIP---------------------- */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')

const customAlphabet = require('nanoid').customAlphabet
const rand_letters = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ', 4)

exports.list_all_trips = function (req, res) {
  Trip.find({ isDeleted: false, draftMode: false }, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_my_trips = function (req, res) {
  Trip.find({ isDeleted: false }, function (err, trips) {
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
  // db.items.find(
  //  {$text: {$search: "samsung"}},
  //  { score: { $meta: "textScore" } }
  //  ).sort( { score: { $meta: "textScore" } } )

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
  Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!trip.draftMode) {
      res.status(403).send('You cannot update a published trip')
    }
    else {
      res.json(trip)
    }
  })

}

exports.cancel_a_trip = function (req, res) {
  const reason = req.body.reasonCancel
  // Need no application accepted validation
  Trip.findOneAndUpdate({ _id: req.params.tripId }, { isCancelled: true, reasonCancel: reason }, { new: true }, function (err, trip) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else if (err === 'A cancellation reason is needed') {
        res.status(403).send(err)
      } else {
        res.status(500).send(err)
      }
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!(new Date(trip.dateStart) > new Date)) {
      res.status(403).send('Cannot cancel already started trips')
    } else {
      res.json(trip)
    }
  })

}

exports.delete_a_trip = function (req, res) {
  Trip.findOneAndUpdate({ _id: req.params.tripId }, { isDeleted: true }, { new: true }, function (err, trip) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    } else if (!trip.draftMode) {
      res.status(403).send('You cannot delete a published trip')
    } else {
      res.json(trip)
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