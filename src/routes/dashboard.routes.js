'use strict'
module.exports = function (app) {
  const dashboards = require('../controllers/dashboard.controller')

  /**
   *
   * @section applications
   * @type get
   * @url /v1/dashboard/applicationsByStatus
  */
  app.route('/v1/dashboard/applicationsByStatus')
    .get(dashboards.applications_by_status)

  app.route('/v1/dashboard/applicationsPerTrip')
    .get(dashboards.applications_per_trip)

  app.route('/v1/dashboard/trips')
    .get(dashboards.trip_statistics)

}