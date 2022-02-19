'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicationSchema = new Schema({
    moment: {type: Date, required: true, default: Date.now },
    status: { type: String, required: true, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'DUE'], default: 'PENDING' },
    rejectedReason: String,
    isPaid: { type: Boolean, default: false },
    ticker: { type: String, required: true },
    comment: [String],
    explorer: { type: Schema.Types.ObjectId, ref: 'Actor' },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip' },
});


module.exports = mongoose.model('Applications', ApplicationSchema);
