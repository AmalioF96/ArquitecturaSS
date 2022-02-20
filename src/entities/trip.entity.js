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
    dateStart: { type: Date, required: true, validate:[dateStartValidator, 'The start date must be in the future']  },
    dateEnd: { type: Date, required: true, validate:[dateEndValidator, 'The start date must be before the end date'] },
    isCancelled: { type: Boolean, required: true, default: false },
    reasonCancel: { type: String },
    draftMode: { type: Boolean, required: true },
    pictures: [String],
    requirements: [String],
    stages: { type: [StageSchema], required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'Actor' },
    isDeleted: { type: Boolean, default: false}
});

function dateStartValidator(value) {
  const actualDate = new Date
  return actualDate <= value;
}

function dateEndValidator(value) {
  return this.dateStart <= value;
}

module.exports = mongoose.model('Trips', TripSchema);
module.exports = mongoose.model('Stages', StageSchema);