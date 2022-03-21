'use strict'
module.exports = function (app) {
  const applications = require('../controllers/application.controller')
  const authController = require('../controllers/authController')

  /**
   *
   * @section applications
   * @type get post
   * @url /v1/applications
   * @param {string} role (clerk|administrator|customer)
  */
  app.route('/v1/applications')
    .get(applications.list_all_applications)
    .post(applications.create_an_application)

  /**
   *
   * @section applications
   * @type get put
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .get(applications.read_an_application)
    .put(applications.update_an_application)
    .delete(applications.delete_an_application)

  /**
   *
   * @section applications
   * @type post 
   * @url /v1/applications/apply/:tripId
  */
   app.route('/v1/applications/apply/:tripId')
   .post(applications.post_an_application)

   /**
   *
   * @section applications
   * @type post 
   * @url /v1/applications/:applicationId/reject
  */
    app.route('/v1/applications/:applicationId/reject')
    .post(applications.reject_an_application)

    /**
   *
   * @section applications
   * @type post 
   * @url /v1/applications/:applicationId/due
  */
     app.route('/v1/applications/:applicationId/due')
     .post(applications.due_an_application)

    /**
   *
   * @section applications
   * @type post 
   * @url /v1/applications/:applicationId/pay
  */
     app.route('/v1/applications/:applicationId/pay')
     .post(applications.pay_an_application)
    
    /**
   *
   * @section applications
   * @type post 
   * @url /v1/applications/:applicationId/cancel
  */
     app.route('/v1/applications/:applicationId/cancel')
     .post(applications.cancel_an_application)


/**
 *
 * @section applications
 * @type post 
 * @url /v2/applications/apply/:tripId
*/
 app.route('/v2/applications/apply/:tripId')
 .post(authController.verifyUser(['EXPLORER']), applications.post_an_application)

 /**
 *
 * @section applications
 * @type post 
 * @url /v2/applications/:applicationId/reject
*/
  app.route('/v2/applications/:applicationId/reject')
  .post(authController.verifyUser(['MANAGER']), applications.reject_an_application)

  /**
 *
 * @section applications
 * @type post 
 * @url /v2/applications/:applicationId/due
*/
   app.route('/v2/applications/:applicationId/due')
   .post(authController.verifyUser(['MANAGER']), applications.due_an_application)

  /**
 *
 * @section applications
 * @type post 
 * @url /v2/applications/:applicationId/pay
*/
   app.route('/v2/applications/:applicationId/pay')
   .post(authController.verifyUser(['EXPLORER']), applications.pay_an_application)



/**
   *
   * @section applications
   * @type post 
   * @url /v2/applications/:applicationId/cancel
  */
 app.route('/v2/applications/:applicationId/cancel')
 .post(authController.verifyUser(['EXPLORER']), applications.cancel_an_application)


/**
*
* @section applications
* @type post 
* @url /v2/applications/getGroupedStatus
*/
 app.route('/v2/applications/getGroupedStatus')
 .get(authController.verifyUser(['EXPLORER']), applications.get_grouped_status)

}