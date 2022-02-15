import mongoose from 'mongoose';
const { Schema } = mongoose;

export default {
  Config: new Schema({
    finderCache: { type: Number, min: 1, max: 24 },
    finderResults: { type: Number, min: 1, max: 100 },
  })
};