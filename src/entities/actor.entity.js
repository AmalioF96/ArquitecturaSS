import mongoose from 'mongoose';
const { Schema } = mongoose;

export default {
  Actor: new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    isBan: Boolean,
    language: { type: String, required: true, enum: ['EN', 'ES'], default: 'ES' },
    role: { type: String, required: true, enum: ['EXPLORER', 'ADMINISTRATOR', 'MANAGER'] },
    isDeleted: { type: Boolean, default: false}
  })
};