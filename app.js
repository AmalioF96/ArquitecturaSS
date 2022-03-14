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

const admin = require('firebase-admin')
const serviceAccount = require('./acmeexplorer-ce4ff-firebase-adminsdk-8jpv4-9027ad22d4')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, idToken') // ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
  next()
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://acmeexplorerauth.firebaseio.com'
})

const routesActors = require('./src/routes/actor.routes')
const routesTrips = require('./src/routes/trip.routes')

const routesApplications = require('./src/routes/application.routes')
const routesFinders = require('./src/routes/finder.routes')

const routesDashboard = require('./src/routes/dashboard.routes')
const routesConfig = require('./src/routes/config.routes')

const routesLogin = require('./src/routes/loginRoutes')


routesActors(app)
routesTrips(app)
routesFinders(app)
routesApplications(app)
routesDashboard(app)
routesConfig(app)
routesLogin(app)
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
