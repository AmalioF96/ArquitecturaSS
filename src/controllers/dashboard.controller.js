'use strict'
const mongoose = require('mongoose')

/* ---------------APPLICATION---------------------- */
const Application = mongoose.model('Applications')

exports.applications_by_status = function (req, res) {
    Application.find({}, function (err, applications) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(applications)
    }
  })
}

exports.applications_per_trip = function (req, res) {
  Application.aggregate([
    {
      '$group': {
        '_id': '$trip', 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$group': {
        '_id': 'Applications per trip statistics', 
        'mean': {
          '$avg': '$count'
        }, 
        'min': {
          '$min': '$count'
        }, 
        'max': {
          '$max': '$count'
        }, 
        'stand_desv': {
          '$stdDevSamp': '$count'
        }
      }
    }
  ], function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.json(data)
    }
  })
}

/* ---------------TRIP---------------------- */
const Trip = mongoose.model('Trips')

exports.trip_statistics = function (req, res) {
  Trip.aggregate([
    {$facet:{
    "tripsPerManager":[
      {
        '$group': {
          '_id': '$manager', 
          'count': {
            '$sum': 1
          }
        }
      }, {
        '$group': {
          '_id': "Trips per manager statistics", 
          'mean': {
            '$avg': '$count'
          }, 
          'min': {
            '$min': '$count'
          }, 
          'max': {
            '$max': '$count'
          }, 
          'stand_desv': {
            '$stdDevSamp': '$count'
          }
        }
      }
    ],
    "tripsPrices":[
      {
        '$group': {
          '_id': 'Trips prices statistics', 
          'mean': {
            '$avg': '$price'
          }, 
          'min': {
            '$min': '$price'
          }, 
          'max': {
            '$max': '$price'
          }, 
          'stand_desv': {
            '$stdDevSamp': '$price'
          }
        }
      }
    ]
  }}], function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.json(data)
    }
  })
}