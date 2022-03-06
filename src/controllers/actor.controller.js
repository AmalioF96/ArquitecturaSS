'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Actor = mongoose.model('Actors')
const bcrypt = require('bcrypt');

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

// exports.create_an_actor = function (req, res) {
//   const newActor = new Actor(req.body)
//   // If new_actor is a customer, validated = true;
//   // If new_actor is a clerk, validated = false;
//   // if ((newActor.role.includes('ADMINISTRATOR'))) {
//   //   newActor.validated = false
//   // } else {
//   //   newActor.validated = true
//   // }
//   newActor.save(function (err, actor) {
//     if (err) {
//       res.send(err)
//     } else {
//       res.json(actor)
//     }
//   })
// }

// exports.create_an_actor = function (req, res) {
//   bcrypt.genSalt(6, function(err, salt) {
//     var newActor = new Actor(req.body)
//     if (err) {
//       res.status(500).send(err)
//     }
//     bcrypt.hash(req.body.password, salt, function(err, hash) {
//       newActor.password = hash
//       newActor.save(function (err, actor) {
//         if (err) {
//           if (err.name === 'ValidationError') {
//             res.status(422).send(err)
//           } else {
//             res.status(500).send(err)
//           }
//         } else {
//           res.json(actor)
//         }
//       })
//     })
//   })
// }


exports.create_an_actor = function (req, res) {
  const newActor = new Actor(req.body)
  // If new_actor is a customer, validated = true;
  // If new_actor is a clerk, validated = false;

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

// exports.update_an_actor = function (req, res) {
//   // Check that the user is the proper actor and if not: res.status(403);
//   // "an access token is valid, but requires more privileges"

//   const newPassword = req.body.password
//   console.log("newPass", newPassword)
//   const actorBody = req.body

//   var salt = bcrypt.genSaltSync(6);
//   var hashi = bcrypt.hash(newPassword, salt, (err, resHash) => {
//     console.log('hash', resHash)
//     var hash = resHash
//     bcrypt.compare(newPassword, hash, (err, resHash) => {
//       console.log('Compared result', resHash, hash) 
//       if (resHash==true) {
//         //Se ha modificado la contraseña
//         console.log("La contraseña ha cambiado")
//         console.log("Contra antes", actorBody.password)
//         req.body.password = hash
//         console.log("Contra después", actorBody.password)
        
//       } else {
//         //No se ha modificado la contraseña
//         console.log("La contraseña no ha cambiado")
//       }
//       console.log('FINAL', req.body.password)
      
//       Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
//         if (err) {
//           if (err.name === 'ValidationError') {
//             res.status(422).send(err)
//           } else {
//             res.status(500).send(err)
//           }
//         } else {
//           console.log('CHECK PASS FINAL', req.body.password)
//           res.json(actor)
//         }
//       })
//     })
  // }); 
// }

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
