'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcrypt = require('bcrypt')

const ActorSchema = new Schema({
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
});

ActorSchema.pre('save', function (callback) {
    const actor = this
    // Break out if the password hasn't changed
    // console.log("La contraseña se ha modificado?", actor.isModified('password'))
    if (!actor.isModified('password')) return callback()
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
      if (err) return callback(err)
  
      bcrypt.hash(actor.password, salt, function (err, hash) {
        if (err) return callback(err)
        actor.password = hash
        callback()
      })
    })
  })
  
  ActorSchema.pre('findOneAndUpdate', function (callback) {
    const actor = this._update
  
    // console.log("La contraseña se ha modificado?", actor.isModified('password'))
    // if (!actor.isModified('password')) return callback()
    const actorId = this._conditions._id
    console.log(this)
    console.log(this._conditions._id)
    console.log(actor)
    console.log(actor.isBan)
    console.log(this.getQuery())
    // ActorSchema.findById(this._conditions._id, function (err, oldActor) {
    //   if (err) {
    //     res.send(err)
    //   } else {
    //     console.log(oldActor)
    //     // res.json(actor)
    //   }
    // })


    if (actor.isDeleted != true && actor.isBan != true) {
      bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err)
    
        bcrypt.hash(actor.password, salt, function (err, hash) {
          if (err) return callback(err)
          actor.password = hash
          callback()
        })
      })
    } else {
      console.log('Eliminando o baneando usuario')
      callback()
    }
  })
  
  ActorSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      console.log('verifying password in actorModel: ' + password)
      if (err) return cb(err)
      console.log('isMatch: ' + isMatch)
      cb(null, isMatch)
    })
  }


  ActorSchema.index({email:1});

module.exports = mongoose.model('Actors', ActorSchema)
