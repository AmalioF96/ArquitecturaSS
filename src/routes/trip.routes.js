'use strict'
module.exports = function (app) {
    const trips = require('../controllers/trip.controller')
    const authController = require('../controllers/authController')

    app.route('/v1/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip)

    app.route('/v2/trips')
        .get(trips.list_all_trips)
        .post(authController.verifyUser(['MANAGER']), trips.create_a_trip_verified)

    app.route('/v1/trips/search')
        .get(trips.search_trips)

    app.route('/v2/trips/search')
        .get(trips.search_trips)

    app.route('/v1/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.update_a_trip)
        .patch(trips.cancel_a_trip)
        .delete(trips.delete_a_trip)

        app.route('/v2/trips/:tripId')
        .get(trips.read_a_trip)
        .put(authController.verifyUser(['MANAGER']), trips.update_a_trip_verified)
        .patch(authController.verifyUser(['MANAGER']),trips.cancel_a_trip_verified)
        .delete(authController.verifyUser(['MANAGER']),trips.delete_a_trip_verified)



}