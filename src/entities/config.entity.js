'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigSchema = new Schema({
    finderCache: { type: Number, min: 1, max: 24 },
    finderResults: { type: Number, min: 1, max: 100 },
});

module.exports = mongoose.model('Configs', ConfigSchema);