'use strict'
/* ---------------APPLICATION---------------------- */
const mongoose = require('mongoose')
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