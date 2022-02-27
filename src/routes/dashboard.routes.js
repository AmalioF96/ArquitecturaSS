"use strict";
module.exports = function (app) {
  const dashboards = require("../controllers/dashboard.controller");

  /**
   *
   * @section applications
   * @type get
   * @url /v1/dashboard/applicationsByStatus
   */
  app
    .route("/v1/dashboard/applicationsByStatus")
    .get(dashboards.applications_by_status);

  app
    .route("/v1/dashboard/applicationsPerTrip")
    .get(dashboards.applications_per_trip);

  app.route("/v1/dashboard/trips")
    .get(dashboards.trip_statistics)

  app.route("/v1/dashboard/tripsPerManager")
    .get(dashboards.trips_per_manager);
  
  app
    .route("/v1/dashboard/finderTopKeyword")
    .get(dashboards.finder_top_keyword);

  app
    .route("/v1/dashboard/finderAvgPrices")
    .get(dashboards.finder_avg_prices);
};
