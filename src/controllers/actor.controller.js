'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Actor = mongoose.model('Actors')
const bcrypt = require('bcrypt');
const authController = require('./authController')
const admin = require('firebase-admin')

exports.list_all_actors = function (req, res) {
  // Check if the role param exist
  /*
  if (req.query.role) {
    const roleName = req.query.role
  }
  */
  // Adapt to find the actors with the specified role
  Actor.find({}, function (err, actors) {
    if (err) {
      res.send(err)
    } else {
      res.json(actors)
    }
  })
}


exports.login_an_actor = async function (req, res) {
  console.log('starting login an actor')
  const emailParam = req.query.email
  const password = req.query.password
  let customToken

  Actor.findOne({ email: emailParam }, function (err, actor) {
    if (err) { // No actor found with that email as username
      res.send(err)
    } else if (!actor) { // an access token isn’t provided, or is invalid
      res.status(401)
      res.json({ message: 'forbidden', error: err })
    } else {    ///////////////////////////////////////////////////////////////////////////////////
      // Make sure the password is correct
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err)
        } else if (!isMatch) { // Password did not match
          res.status(401) // an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err })
        } else {
          try {
            customToken = await admin.auth().createCustomToken(actor.email)
          } catch (error) {
            console.log('Error creating custom token:', error)
          }
          actor.customToken = customToken
          res.json(actor)
        }
      })
    }
  })
}



exports.create_an_admin = function (req, res) {
  var newActor = new Actor(req.body)
  newActor.role = 'ADMINISTRATOR'
  newActor.save(function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}

exports.create_an_explorer = function (req, res) {
  var newActor = new Actor(req.body)
  newActor.role = 'EXPLORER'
  newActor.save(function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}

exports.create_a_manager = function (req, res) {
  var newActor = new Actor(req.body)
  newActor.role = 'MANAGER'
  newActor.save(function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}


//v2
exports.create_an_admin_verified = function (req, res) {
  var newActor = new Actor(req.body)
  newActor.role = 'ADMINISTRATOR'
  newActor.save(function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}

//v2
exports.create_a_manager_verified = function (req, res) {
  var newActor = new Actor(req.body)
  newActor.role = 'MANAGER'
  newActor.save(function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}


exports.read_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}


function compare(encrypted) {
  bcrypt.compare('aboveusedpassword', encrypted, (err, res) => {
      // res == true or res == false
      console.log('Compared result', res, hash) 
  })
}

exports.update_an_actor = function (req, res) {
  // Check that the user is the proper actor and if not: res.status(403);
  // "an access token is valid, but requires more privileges"


  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
    if (err) {
      console.log(err)
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}

//v2
exports.update_a_verified_actor = function (req, res) {
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      console.log('actor: ' + actor)
      const idToken = req.headers.idtoken 
      // Si es manager o explorer se comprueba que el que se edita
      // es el que ha iniciado sesión
      if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER')) { 
        const authenticatedUserId = await authController.getUserId(idToken)

        if (authenticatedUserId == req.params.actorId) {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
            if (err) {
              res.send(err)
            } else {
              res.json(actor)
            }
          })
        } else {
          res.status(403) // Auth error
          res.send('Está intentando editar un actor que no es usted.')
        }
      } else if (actor.role.includes('ADMINISTRATOR')) {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
          if (err) {
            res.send(err)
          } else {
            res.json(actor)
          }
        })
      } else {
        res.status(405) // Not allowed
        res.send('Los roles del usuario no se encontraron.')
      }
    }
  })
}

exports.delete_an_actor = function (req, res) {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { isDeleted: true , name: 'XXXX', surname: 'XXXX', email: 'XXXX', phone: 'XXXX'}, { new: true }, function (err, actor) {
    console.log(actor)
    if (err) {
      console.log(err)
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else if (!actor) {
      res.status(404).send('Not existing actor')
    } else {
      res.json(actor)
    }

    })
  }

  //v2
  exports.delete_a_verified_actor = function (req, res) {
    Actor.findById(req.params.actorId, async function (err, actor) {
      if (err) {
        res.send(err)
      } else {
        console.log('actor: ' + actor)
        const idToken = req.headers.idtoken 
        // Si es manager o explorer se comprueba que el que se edita
        // es el que ha iniciado sesión
        if (actor.role.includes('MANAGER') || actor.role.includes('EXPLORER')) { 
          const authenticatedUserId = await authController.getUserId(idToken)
  
          if (authenticatedUserId == req.params.actorId) {
            Actor.findOneAndUpdate({ _id: req.params.actorId }, { isDeleted: true , name: 'XXXX', surname: 'XXXX', email: 'XXXX', phone: 'XXXX'}, { new: true }, function (err, actor) {
              if (err) {
                res.send(err)
              } else {
                res.json(actor)
              }
            })
          } else {
            res.status(403) // Auth error
            res.send('Está intentando editar un actor que no es usted.')
          }
        } else if (actor.role.includes('ADMINISTRATOR')) {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, { isDeleted: true , name: 'XXXX', surname: 'XXXX', email: 'XXXX', phone: 'XXXX'} , { new: true }, function (err, actor) {
            if (err) {
              res.send(err)
            } else {
              res.json(actor)
            }
          })
        } else {
          res.status(405) // Not allowed
          res.send('Los roles del usuario no se encontraron.')
        }
      }
    })



    }

  exports.ban_an_actor = function (req, res) {


    Actor.findById(req.params.actorId, function (err, oldActor) {
      if (err) {
        res.send(err)
      } else {
        if (oldActor.isBan==true){
          res.status(500).send("Can't ban an actor already banned.")
        } else {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, { isBan: true }, { new: true }, function (err, actor) {
          if (err) {
            console.log(err)
            if (err.name === 'ValidationError') {
              res.status(422).send(err)
            } else {
              res.status(500).send(err)
            }
          } else if (!actor) {
            res.status(404).send('Not existing actor')
          } else {
            res.json(actor)
          }
      
          })
      }}
    })
    }
  
    exports.unban_an_actor = function (req, res) {
      Actor.findById(req.params.actorId, function (err, oldActor) {
        if (err) {
          res.send(err)
        } else {
          if (oldActor.isBan!=true){
            res.status(500).send("Can't unban an actor unbanned.")
          } else {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, { isBan: false }, { new: true }, function (err, actor) {
            if (err) {
              console.log(err)
              if (err.name === 'ValidationError') {
                res.status(422).send(err)
              } else {
                res.status(500).send(err)
              }
            } else if (!actor) {
              res.status(404).send('Not existing actor')
            } else {
              res.json(actor)
            }
        
            })
        }}
      })
      }
