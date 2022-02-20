'use strict'
module.exports = function (app) {
    const trips = require('../controllers/trip.controller')

    app.route('/v1/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip)

    app.route('/v1/trips/search')
        .get(trips.search_trips)

    app.route('/v1/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.update_a_trip)
        .patch(trips.cancel_a_trip)
        .delete(trips.delete_a_trip)

    app.route('/v1/stages')
        .post(trips.create_a_stage)

    app.route('/v1/stages/:stageId')
        .get(trips.read_a_stage)

    app.route('/v1/mytrips’')
        .get(trips.list_my_trips)

}