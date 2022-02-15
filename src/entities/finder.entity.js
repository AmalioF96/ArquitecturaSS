import mongoose from 'mongoose';
const { Schema } = mongoose;

export default {
  Finder: new Schema({
    keyword: String,
    dateStart: Date,
    dateEnd: Date,
    priceMin: Number,
    priceMax: Number,
    explorer: { type: Schema.Types.ObjectId, ref: 'Actor' },
    trips: { type: [Schema.Types.ObjectId], ref: 'Trip' },
  })
};