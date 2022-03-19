'use strict'
/* ---------------APPLICATION---------------------- */
const mongoose = require('mongoose')
const Application = mongoose.model('Applications')
const Trip = mongoose.model('Trips')
const moment = require("moment")

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
  Application.findOneAndUpdate({ _id: req.params.applicationId }, { isDeleted: true }, { new: true }, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(204).send()
    }
  })
}

exports.post_an_application = function (req, res) {
  var trip = Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else if (!trip) {
      res.status(404).send('Non existing trip')
    }
    else {
      if (trip.isCancelled){
        res.status(400).send('The trip is cancelled')
      }else{
        var tickerDate = new Date()
        if (trip.dateStart > tickerDate){
          var ticker = moment(tickerDate).format("YYMMDD") + "-" + generateRandomLetters()
          const newApplication = new Application({...req.body, ticker: ticker, trip: req.params.tripId})
          newApplication.save(function (err, application) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.status(201).json(application)
            }
          })
        }else{
          res.status(400).send('The trip has already started')
        }
      }
    }
  })
}

function generateRandomLetters() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  var output = ""
  for (let index = 0; index < 4; index++) {
    output = output + alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return output
}


exports.reject_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!application){
        res.status(404).send('Non existing application')
      }else{
        if ( application.status != 'PENDING'){
          res.status(400).send('The application status should be PENDING')
        } else {
          Application.findOneAndUpdate({ _id: req.params.applicationId }, { status: "REJECTED", rejectedReason: req.body.rejectedReason }, { new: true }, (err, applicationUpdated) => {
            if (err) {
              res.status(500).send(err)
            } else {
              res.status(200).json(applicationUpdated)
            }
          })
        }
      }
    }
  })
}


exports.due_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!application){
        res.status(404).send('Non existing application')
      }else{
        if ( application.status != 'PENDING'){
          res.status(400).send('The application status should be PENDING')
        } else {
          Application.findOneAndUpdate({ _id: req.params.applicationId }, { status: "DUE" }, { new: true }, (err, applicationUpdated) => {
            if (err) {
              res.status(500).send(err)
            } else {
              res.status(200).json(applicationUpdated)
            }
          })
        }
      }
    }
  })
}

exports.pay_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!application){
        res.status(404).send('Non existing application')
      }else{
        if ( application.status != 'DUE'){
          res.status(400).send('The application status should be DUE')
        } else {
          Application.findOneAndUpdate({ _id: req.params.applicationId }, { status: "ACCEPTED" }, { new: true }, (err, applicationUpdated) => {
            if (err) {
              res.status(500).send(err)
            } else {
              res.status(200).json(applicationUpdated)
            }
          })
        }
      }
    }
  })
}
