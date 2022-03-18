'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FinderSchema = new Schema({
    keyword: String,
    dateStart: Date,
    dateEnd: Date,
    searchTime: Date,
    priceMin: Number,
    priceMax: Number,
    explorer: { type: Schema.Types.ObjectId, ref: 'Actor' },
    trips: { type: [Schema.Types.ObjectId], ref: 'Trip' },
});
FinderSchema.index({explorer:1});

module.exports = mongoose.model('Finders', FinderSchema);