'use strict'
const mongoose = require('mongoose')
const Config = mongoose.model('Configs')


exports.update_a_config = function (req, res) {
    Config.updateOne(req.body, function (err, config) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).json(req.body)
        }
        })

  }

exports.read_a_config =  function (req, res) {
    Config.find({}, function (err, configs) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(configs)
    }
  })
}
  