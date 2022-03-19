"use strict";
module.exports = function (app) {
  const finders = require("../controllers/finder.controller");
  const authController = require('../controllers/authController');

  /**
   * Get an finder
   * Post an finder
   *
   * @section finders
   * @type get post
   * @url /v1/finders
   */
  app
    .route("/v1/finders")
    .get(finders.list_all_finders)
    .post(finders.create_an_finder);

  /**
   * Put an finder
   *    RequiredRoles: to be the proper finder
   * Get an finder
   *    RequiredRoles: to be the proper finder or an Administrator
   *
   * @section finders
   * @type get put delete
   * @url /v1/finders/:finderId
   */
  app
    .route("/v1/finders/:finderId")
    .get(finders.read_an_finder)
    .put(finders.update_an_finder)
    .delete(finders.delete_an_finder);
  
    /**
   * @section finders
   * @type post
   * @url /v1/finders/findTrip
   * 
   */
  app.route("/v1/finders/findTrip").post(finders.find_trips);

  
  /**
   * @section finders
   * @type post
   * @url /v2/finders/findTrip
   * 
   */
  app.route("/v2/finders/findTrip")
     .post(authController.verifyUser(['EXPLORER']), finders.find_trips);
};
