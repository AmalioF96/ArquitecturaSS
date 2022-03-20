const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

// Creation of normal trip and published trip id´s variable 
var tripId, tripIdPub;

// Declaration of invented trip
const tripIdInv = "6234d69bdc3e8c3e6c52b179";

describe("Trips API", () => {
    /**
   * TEST GET trips
   */
    describe("GET /v1/trips", () => {
        it("Trying to get all data", (done) => {
            chai
                .request(app)
                .get("/v1/trips")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("array");
                    done();
                });
        });
    });

    /**
     * TEST POST trip
     */
    describe("POST /v1/trips", () => {
        it("Trying to POST a trip manually", (done) => {
            const trip = {
                title: "Velada en la playa",
                description: "Maravillosa velada en la playa",
                dateStart: "2050-12-25T22:15:30.000Z",
                dateEnd: "2050-12-27T22:15:30.000Z",
                draftMode: true,
                manager: "6234d69bdc3e8c3e6c52b179",
                stages: [
                    {
                        title: "Paseo en barco",
                        description: "Paseo al atardecer en barco para poder acercarnos a la vida marina",
                        price: 100
                    },
                    {
                        title: "Paseo por la playa",
                        description: "Paseo al atardecer por una de las mejores playas vírgenes de todo el mundo",
                        price: 115
                    }
                ]
            };
            chai
                .request(app)
                .post("/v1/trips")
                .send(trip)
                .end((err, res) => {
                    tripId = res.body._id
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("ticker");
                    expect(res.body).to.have.property("title");
                    expect(res.body).to.have.property("description");
                    expect(res.body).to.have.property("dateStart");
                    expect(res.body).to.have.property("dateEnd");
                    expect(res.body).to.have.property("draftMode");
                    expect(res.body).to.have.property("isCancelled");
                    expect(res.body).to.have.property("isDeleted");
                    expect(res.body).to.have.property("stages");
                    expect(res.body).to.have.property("manager");
                    expect(res.body.price).to.equal(215);
                    expect(res.body).to.have.property("_id");
                    done();
                });
        });

        it("Trying to POST a second trip manually", (done) => {
            const trip = {
                title: "Velada en la playa",
                description: "Maravillosa velada en la playa",
                dateStart: "2050-12-25T22:15:30.000Z",
                dateEnd: "2050-12-27T22:15:30.000Z",
                draftMode: true,
                manager: "6234d69bdc3e8c3e6c52b179",
                stages: [
                    {
                        title: "Paseo en barco",
                        description: "Paseo al atardecer en barco para poder acercarnos a la vida marina",
                        price: 130
                    },
                    {
                        title: "Paseo por la playa",
                        description: "Paseo al atardecer por una de las mejores playas vírgenes de todo el mundo",
                        price: 220
                    }
                ]
            };
            chai
                .request(app)
                .post("/v1/trips")
                .send(trip)
                .end((err, res) => {
                    tripIdPub = res.body._id
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("ticker");
                    expect(res.body).to.have.property("title");
                    expect(res.body).to.have.property("description");
                    expect(res.body).to.have.property("dateStart");
                    expect(res.body).to.have.property("dateEnd");
                    expect(res.body).to.have.property("draftMode");
                    expect(res.body).to.have.property("isCancelled");
                    expect(res.body).to.have.property("isDeleted");
                    expect(res.body).to.have.property("stages");
                    expect(res.body).to.have.property("manager");
                    expect(res.body.price).to.equal(350);
                    expect(res.body).to.have.property("_id");
                    done();
                });
        });
    });

    /**
      * TEST GET trip by id
      */
    describe("GET /v1/trips/:tripId", () => {
        it("Trying to GET a trip", (done) => {
            chai
                .request(app)
                .get("/v1/trips/" + tripId)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("ticker");
                    expect(res.body).to.have.property("title");
                    expect(res.body).to.have.property("description");
                    expect(res.body).to.have.property("dateStart");
                    expect(res.body).to.have.property("dateEnd");
                    expect(res.body).to.have.property("draftMode");
                    expect(res.body).to.have.property("isCancelled");
                    expect(res.body).to.have.property("isDeleted");
                    expect(res.body).to.have.property("stages");
                    expect(res.body).to.have.property("manager");
                    expect(res.body.price).to.equal(215);
                    expect(res.body).to.have.property("_id");
                    done();
                });
        });

        it("Trying to GET a trip - Error 404", (done) => {
            chai
                .request(app)
                .get("/v1/trips/" + tripIdInv)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    /**
   * Test PUT trip
   */
    describe("PUT /v1/trips/:id", () => {
        it("Trying to PUT a trip manually", (done) => {
            const updatedTrip = {
                title: "Velada en la playa de Marbella",
                description: "Maravillosa velada en la premiada playa de Marbella",
                draftMode: true,
                dateStart: "2050-12-25T22:15:30.000Z",
                dateEnd: "2050-12-27T22:15:30.000Z",
                stages: [
                    {
                        title: "Paseo en barco de lujo",
                        description: "Paseo al atardecer en barco para poder acercarnos a la vida marina",
                        price: 450
                    },
                    {
                        title: "Paseo por la playa",
                        description: "Paseo al atardecer por una de las mejores playas de todo el mundo",
                        price: 150
                    }
                ]
            };
            chai
                .request(app)
                .put("/v1/trips/" + tripId)
                .send(updatedTrip)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.have.property("ticker");
                    expect(res.body).to.have.property("title");
                    expect(res.body.title).to.equal("Velada en la playa de Marbella")
                    expect(res.body).to.have.property("description");
                    expect(res.body.description).to.equal("Maravillosa velada en la premiada playa de Marbella")
                    expect(res.body).to.have.property("dateStart");
                    expect(res.body).to.have.property("dateEnd");
                    expect(res.body).to.have.property("draftMode");
                    expect(res.body).to.have.property("isCancelled");
                    expect(res.body).to.have.property("isDeleted");
                    expect(res.body).to.have.property("stages");
                    expect(res.body).to.have.property("manager");
                    expect(res.body.price).to.equal(600);
                    expect(res.body).to.have.property("_id");
                    done();
                });
        });

        it("Trying to PUT the second trip manually", (done) => {
            const updatedTrip = {
                title: "Velada en la playa de Marbella",
                description: "Maravillosa velada en la premiada playa de Marbella",
                draftMode: false,
                dateStart: "2050-12-25T22:15:30.000Z",
                dateEnd: "2050-12-27T22:15:30.000Z",
                stages: [
                    {
                        title: "Paseo en barco de lujo",
                        description: "Paseo al atardecer en barco para poder acercarnos a la vida marina",
                        price: 450
                    },
                    {
                        title: "Paseo por la playa",
                        description: "Paseo al atardecer por una de las mejores playas de todo el mundo",
                        price: 150
                    }
                ]
            };
            chai
                .request(app)
                .put("/v1/trips/" + tripIdPub)
                .send(updatedTrip)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.have.property("ticker");
                    expect(res.body).to.have.property("title");
                    expect(res.body.title).to.equal("Velada en la playa de Marbella")
                    expect(res.body).to.have.property("description");
                    expect(res.body.description).to.equal("Maravillosa velada en la premiada playa de Marbella")
                    expect(res.body).to.have.property("dateStart");
                    expect(res.body).to.have.property("dateEnd");
                    expect(res.body).to.have.property("draftMode");
                    expect(res.body.draftMode).to.equal(false)
                    expect(res.body).to.have.property("isCancelled");
                    expect(res.body).to.have.property("isDeleted");
                    expect(res.body).to.have.property("stages");
                    expect(res.body).to.have.property("manager");
                    expect(res.body.price).to.equal(600);
                    expect(res.body).to.have.property("_id");
                    done();
                });
        });

        it("Trying to PUT a trip manually - Error 404", (done) => {
            const updatedTrip = {
                title: "Velada en la playa de Marbella",
                description: "Maravillosa velada en la premiada playa de Marbella",
                draftMode: false,
                dateStart: "2050-12-25T22:15:30.000Z",
                dateEnd: "2050-12-27T22:15:30.000Z",
                stages: [
                    {
                        title: "Paseo en barco de lujo",
                        description: "Paseo al atardecer en barco para poder acercarnos a la vida marina",
                        price: 450
                    },
                    {
                        title: "Paseo por la playa",
                        description: "Paseo al atardecer por una de las mejores playas de todo el mundo",
                        price: 150
                    }
                ]
            };
            chai
                .request(app)
                .put("/v1/trips/" + tripIdInv)
                .send(updatedTrip)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("Trying to PUT the second trip manually - Error 403", (done) => {
            chai
                .request(app)
                .put("/v1/trips/" + tripIdPub)
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    done();
                });
        });
    });

    /**
    * Test PATCH trip
    */
    describe("PATCH /v1/trips/:id", () => {
        it("Trying to cancel a trip", (done) => {
            const tripCancellation = {
                reasonCancel: "Riesgo de tormenta"
            };
            chai
                .request(app)
                .patch("/v1/trips/" + tripId)
                .send(tripCancellation)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("Trying to cancel a trip - 403", (done) => {
            chai
                .request(app)
                .patch("/v1/trips/" + tripIdPub)
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    done();
                });
        });

        it("Trying to cancel a trip - 404", (done) => {
            chai
                .request(app)
                .patch("/v1/trips/" + tripIdInv)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    /**
     * Test DELETE trip
     */
    describe("DELETE /v1/trips/:id", () => {
        it("Trying to DELETE a trip", (done) => {
            chai
                .request(app)
                .delete("/v1/trips/" + tripId)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("Trying to DELETE a trip - 403", (done) => {
            chai
                .request(app)
                .delete("/v1/trips/" + tripIdPub)
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    done();
                });
        });
    });

});