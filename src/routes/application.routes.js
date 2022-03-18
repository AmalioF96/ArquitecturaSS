'use strict'
module.exports = function (app) {
  const applications = require('../controllers/application.controller')

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
}