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

// TODO: Código de álvaro BORRAR?
// exports.create_an_actor = function (req, res) {
//   const newActor = new Actor(req.body)
//   // If new_actor is a customer, validated = true;
//   // If new_actor is a clerk, validated = false;
//   if ((newActor.role.includes('ADMINISTRATOR'))) {
//     newActor.validated = false
//   } else {
//     newActor.validated = true
//   }
//   newActor.save(function (err, actor) {
//     if (err) {
//       res.send(err)
//     } else {
//       res.json(actor)
//     }
//   })
// }

exports.create_an_actor = function (req, res) {
  bcrypt.genSalt(6, function(err, salt) {
    var newActor = new Actor(req.body)
    if (err) {
      res.status(500).send(err)
    }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      newActor.password = hash
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
    })
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

  const newPassword = req.body.password
  console.log("newPass", newPassword)
  const actorBody = req.body

  var salt = bcrypt.genSaltSync(6);
  bcrypt.hash(newPassword, salt, (err, res) => {
    console.log('hash', res)
    var hash = res
    bcrypt.compare(newPassword, hash, (err, res) => {
      console.log('Compared result', res, hash) 
      if (res==true) {
        //Se ha modificado la contraseña
        console.log("La contraseña ha cambiado")
        console.log("Contra antes", actorBody.password)
        req.body.password = hash
        console.log("Contra después", actorBody.password)
      } else {
        //No se ha modificado la contraseña
        console.log("La contraseña no ha cambiado")
      }
    })
  }); 



  Actor.findOneAndUpdate({ _id: req.params.actorId }, actorBody, { new: true }, function (err, actor) {
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



exports.delete_an_actor = function (req, res) {
    res.send('ERROR');
  }

