'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StageSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
});

const TripSchema = new Schema({
    ticker: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: Number,
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    isCancelled: { type: Boolean, required: true, default: false },
    reasonCancel: String,
    draftMode: { type: Boolean, required: true },
    pictures: [String],
    requirements: [String],
    stages: { type: [StageSchema], required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'Actor' },
    isDeleted: { type: Boolean, default: false}
});


module.exports = mongoose.model('Trips', TripSchema);
module.exports = mongoose.model('Stages', StageSchema);