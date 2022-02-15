import mongoose from 'mongoose';
const { Schema } = mongoose;

const StageSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
});

export default {
  Trip: new Schema({
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
  })
};