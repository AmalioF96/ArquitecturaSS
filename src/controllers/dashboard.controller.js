'use strict'
/* ---------------APPLICATION---------------------- */
const mongoose = require('mongoose')
const Application = mongoose.model('Applications')

exports.applications_by_status = function (req, res) {
    Application.aggregate([
      {
        '$facet': {
          'total': [
            {
              '$group': {
                '_id': null, 
                'total': {
                  '$sum': 1
                }
              }
            }
          ], 
          'groupedStatus': [
            {
              '$group': {
                '_id': '$status', 
                'total': {
                  '$sum': 1
                }
              }
            }
          ]
        }
      }, {
        '$project': {
          '_id': 0, 
          'groupedTotal': '$groupedStatus', 
          'total': '$total.total'
        }
      }, {
        '$unwind': {
          'path': '$total'
        }
      }, {
        '$unwind': {
          'path': '$groupedTotal'
        }
      }, {
        '$project': {
          '_id': 0, 
          'status': '$groupedTotal._id', 
          'ratio': {
            '$divide': [
              '$groupedTotal.total', '$total'
            ]
          }
        }
      }
    ], function (err, applications) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).json(applications)
        }
    })
}