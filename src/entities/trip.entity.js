'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customAlphabet = require('nanoid').customAlphabet
const rand_letters = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ', 4)

const StageSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
});

const TripSchema = new Schema({
  ticker: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: Number,
  dateStart: { type: Date, required: true, validate: [dateStartValidator, 'The start date must be in the future'] },
  dateEnd: { type: Date, required: true, validate: [dateEndValidator, 'The start date must be before the end date'] },
  isCancelled: { type: Boolean, required: true, default: false },
  reasonCancel: { type: String },
  draftMode: { type: Boolean, required: true, default: true },
  pictures: [String],
  requirements: [String],
  stages: { type: [StageSchema], required: true },
  manager: { type: Schema.Types.ObjectId, ref: 'Actor' },
  isDeleted: { type: Boolean, default: false }
});

TripSchema.index({ ticker: 'text', title: 'text', description: 'text' })

TripSchema.pre('save', function (callback) {
  var newTrip = this
  newTrip.ticker = tickerGenerator()
  newTrip.price = priceComputing(newTrip.stages)
  callback()
})

TripSchema.pre('findOneAndUpdate', function (callback) {
  var updatedTrip = this._update
  console.log(updatedTrip)
  if (!updatedTrip.isCancelled) {
    if (!(new Date(updatedTrip.dateStart) > new Date)) {
      return callback('The start date must be in the future')
    } else if (!(new Date(updatedTrip.dateStart) < new Date(updatedTrip.dateEnd))) {
      return callback('The start date must be before the end date')
    } else {
      updatedTrip.price = priceComputing(updatedTrip.stages)
      console.log(updatedTrip)
      callback()
    }
  } else {
    if (!updatedTrip.reasonCancel || !updatedTrip.reasonCancel.replace(/\s/g, "") ) {
      return callback('A cancellation reason is needed')
    } else {
      callback()
    }
  }

})

function tickerGenerator() {
  var res = "";
  const date = new Date
  const year = date.getFullYear().toString().substr(-2)
  res = year + (date.getMonth() + 1).toString() + date.getDate().toString() + "-" + rand_letters()
  return res;
}

function priceComputing(stages) {
  var res = 0;

  stages.forEach(st => {
    res = st.price + res;
  });

  return res;
}

function dateStartValidator(value) {
  const actualDate = new Date
  return actualDate < value;
}

function dateEndValidator(value) {
  return this.dateStart < value;
}

module.exports = mongoose.model('Trips', TripSchema);
module.exports = mongoose.model('Stages', StageSchema);