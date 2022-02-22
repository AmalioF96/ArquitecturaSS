'use strict'
/* ---------------APPLICATION---------------------- */
const mongoose = require('mongoose')
const Application = mongoose.model('Applications')

exports.list_all_applications = function (req, res) {
    Application.find({}, function (err, applications) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(applications)
    }
  })
}

exports.create_an_application = function (req, res) {
  const newApplication = new Application(req.body)
  newApplication.save(function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).json(application)
    }
  })
}


exports.read_an_application = function (req, res) {
    Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(application)
    }
  })
}

exports.update_an_application = function (req, res) {
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(application)
    }
  })
}

exports.delete_an_application = function (req, res) {
    res.send('ERROR');
  }

