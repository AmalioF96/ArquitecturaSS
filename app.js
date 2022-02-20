/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')

const Actor = require('./src/entities/actor.entity')
const Application = require('./src/entities/application.entity')
const Config = require('./src/entities/config.entity')
const Finder = require('./src/entities/finder.entity')
const Trip = require('./src/entities/trip.entity')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routesActors = require('./src/routes/actor.routes')
const routesTrips = require('./src/routes/trip.routes')

routesActors(app)
routesTrips(app)
//routesOrders(app)
//routesStorage(app)

// MongoDB URI building
const mongoDBUser = process.env.mongoDBUser || 'myUser1'
const mongoDBPass = process.env.mongoDBPass || 'myUserPassword1'
const mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ':' + mongoDBPass + '@' : ''

const mongoDBHostname = process.env.mongoDBHostname || 'localhost'
const mongoDBPort = process.env.mongoDBPort || '27017'
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer'

const mongoDBURI = 'mongodb://' 
// + mongoDBCredentials
 + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName

// mongoose.connect(mongoDBURI)
mongoose.connect(mongoDBURI, {
  // reconnectTries: 10,
  // reconnectInterval: 500,
  // poolSize: 10, // Up to 10 sockets
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // skip trying IPv6
  useNewUrlParser: true,
  useUnifiedTopology: true
})
console.log('Connecting DB to: ' + mongoDBURI)

mongoose.connection.on('open', function () {
  app.listen(port, function () {
    console.log('ACME-Explorer RESTful API server started on: ' + port)
  })
})

mongoose.connection.on('error', function (err) {
  console.error('DB init error ' + err)
})
