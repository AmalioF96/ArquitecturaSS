'use strict'
module.exports = function (app) {
  const actors = require('../controllers/actor.controller')

  /**
   * Get an actor who is clerk (any role)
   *    Required role: Administrator
   * Post an actor
   *    RequiredRoles: None
   *    validated if customer and not validated if clerk
   *
   * @section actors
   * @type get post
   * @url /v1/actors
   * @param {string} role (clerk|administrator|customer)
  */
  app.route('/v1/actors')
    .get(actors.list_all_actors)

  app.route('/v1/actors/admin')
    .post(actors.create_an_admin)
  
  app.route('/v1/actors/explorer')
    .post(actors.create_an_explorer)
  
  app.route('/v1/actors/manager')
    .post(actors.create_a_manager)

  app.route('/v2/actors')
    .get(authController.verifyUser(['ADMINISTRATOR']), actors.list_all_actors)
  
  app.route('/v2/actors/admin')
    .post(authController.verifyUser(['ADMINISTRATOR']), actors.create_an_admin_verified)
    
  app.route('/v2/actors/explorer')
    .post(actors.create_an_explorer)
  
  app.route('/v2/actors/manager')
    .post(authController.verifyUser(['ADMINISTRATOR']), actors.create_a_manager_verified)


  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
   *
   * @section actors
   * @type get put
   * @url /v1/actors/:actorId
  */
  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor)
    .delete(actors.delete_an_actor)

  app.route('/v1/actors/:actorId/ban')
    .put(actors.ban_an_actor)

  app.route('/v1/actors/:actorId/unban')
    .put(actors.unban_an_actor)


  app.route('/v2/actors/:actorId')
    .get(authController.verifyUser(['ADMINISTRATOR', 'EXPLORER', 'MANAGER']), actors.read_an_actor)
    .put(authController.verifyUser(['ADMINISTRATOR', 'EXPLORER', 'MANAGER']), actors.update_a_verified_actor)
    .delete(authController.verifyUser(['ADMINISTRATOR', 'EXPLORER', 'MANAGER']), actors.delete_a_verified_actor)

  app.route('/v2/actors/:actorId/ban')
    .put(authController.verifyUser(['ADMINISTRATOR']), actors.ban_an_actor)

  app.route('/v2/actors/:actorId/unban')
    .put(authController.verifyUser(['ADMINISTRATOR']), actors.unban_an_actor)




}