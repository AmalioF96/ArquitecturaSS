"use strict";
module.exports = function (app) {
  const dashboards = require("../controllers/dashboard.controller");
  const authController = require('../controllers/authController')

  /**
   *
   * @section applications
   * @type get
   * @url /v1/dashboard/applicationsByStatus
   */
  app.route("/v1/dashboard/applicationsByStatus")
    .get(dashboards.applications_by_status);

  app.route("/v2/dashboard/applicationsByStatus")
    .get(authController.verifyUser(['ADMINISTRATOR']), dashboards.applications_by_status);

  app.route("/v1/dashboard/applicationsPerTrip")
    .get(dashboards.applications_per_trip);

  app.route("/v2/dashboard/applicationsPerTrip")
    .get(authController.verifyUser(['ADMINISTRATOR']), dashboards.applications_per_trip);

  app.route("/v1/dashboard/tripsPrices")
    .get(dashboards.trips_prices)

  app.route("/v2/dashboard/tripsPrices")
    .get(authController.verifyUser(['ADMINISTRATOR']), dashboards.trips_prices)

  app.route("/v1/dashboard/tripsPerManager")
    .get(dashboards.trips_per_manager);

  app.route("/v2/dashboard/tripsPerManager")
    .get(authController.verifyUser(['ADMINISTRATOR']), dashboards.trips_per_manager);

  app.route("/v1/dashboard/finderTopKeyword")
    .get(dashboards.finder_top_keyword);

  app.route("/v2/dashboard/finderTopKeyword")
    .get(authController.verifyUser(['ADMINISTRATOR']), dashboards.finder_top_keyword);

  app.route("/v1/dashboard/finderAvgPrices")
    .get(dashboards.finder_avg_prices);

  app.route("/v2/dashboard/finderAvgPrices")
    .get(authController.verifyUser(['ADMINISTRATOR']), dashboards.finder_avg_prices);
};
