const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("Actors API", () => {
    /**
   * TEST GET actor
   */
   describe("GET /v1/actors", () => {
    it("Trying to get all data", (done) => {
      chai
        .request(app)
        .get("/v1/actors")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
          done();
        });
    });
  });

  /**
   * TEST POST actor explorer
   */
   describe("POST /v1/actors/explorer", () => {
    it("Trying to POST a actor manually", (done) => {
      const explorer = {
        name: "Emilio",
        surname: "Estévez",
        email: "eestev@gmail.com",
        password: "123cinco",
        phone: "612312345",
        address: "Estepa",
        isBan: false,
        language: "ES",
        isDeleted: false,
        _id: "6234cb5e936c0d265b3b017e"
      };
      chai
        .request(app)
        .post("/v1/actors/explorer")
        .send(explorer)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("email");
          expect(res.body.role).to.equal('EXPLORER')
          done();
        });
    });
  });


    /**
   * TEST POST actor manager
   */
     describe("POST /v1/actors/manager", () => {
        it("Trying to POST a manager manually", (done) => {
          const explorer = {
            name: "Manuel",
            surname: "Martín",
            email: "mamartin2@gmail.com",
            password: "123seis",
            phone: "678912123",
            address: "Málaga",
            isBan: false,
            language: "ES",
            isDeleted: false,
            _id: "6234cee80d8ed6196df6dcc7" 
          };
          chai
            .request(app)
            .post("/v1/actors/manager")
            .send(explorer)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("email");
              expect(res.body.role).to.equal('MANAGER')
              done();
            });
        });
      });

  /**
   * TEST POST actor administrator
   */
   describe("POST /v1/actors/admin", () => {
    it("Trying to POST a actor manually", (done) => {
      const admin = {
        name: "Antonio",
        surname: "Antúnez",
        email: "antantunez@gmail.com",
        password: "123cuatro",
        phone: "678912345",
        address: "Almería",
        isBan: false,
        language: "ES",
        isDeleted: false,
        _id: "6234cdc20d8ed6196df6dcb7"
      };
      chai
        .request(app)
        .post("/v1/actors/admin")
        .send(admin)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("email");
          expect(res.body.role).to.equal('ADMINISTRATOR')
          done();
        });
    });
  });

 /**
   * TEST GET (by id) route
   */
  describe("GET /v1/actors/:actorId", () => {
    it("Trying to GET an actor", (done) => {
      const actorId = "6234cb5e936c0d265b3b017e";
      chai
        .request(app)
        .get("/v1/actors/" + actorId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("email");
          done();
        });
    });

    it("Trying to GET an actor - Error", (done) => {
      const actorId = "-1";
      chai
        .request(app)
        .get("/v1/actors/" + actorId)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  
  /**
   * Test DELETE actor
   */
   describe("DELETE /v1/actors/:id", () => {
    it("Trying to DELETE a actor", (done) => {
      const actorId = "6234cb5e936c0d265b3b017e";

      chai
        .request(app)
        .delete("/v1/actors/" + actorId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

    /**
   * Test PUT route
   */
     describe("PUT /v1/actors/:id", () => {
        it("Trying to PUT an actor Manually", (done) => {
            const testId = "6234cee80d8ed6196df6dcc7";
            const actor = {
              name: "Manolito (editado)",
              surname: "Martínez (editado)",
              email: "manmartin@gmail.com",
              password: "123edit",
              phone: "678912125",
              address: "Madrid (editado)",
              isBan: false,
              language: "ES",
              role: "MANAGER",
              isDeleted: false
            };
            chai
              .request(app)
              .put("/v1/actors/" + testId)
              .send(actor)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("object");
                expect(res.body).to.have.property("email");
                expect(res.body).to.have.property("role").eq("MANAGER");
                done();
              });
          });
      });

    /**
    * Test BAN route
    */
     describe("PUT (BAN) /v1/actors/:id/ban", () => {
        it("Trying to BAN an actor Manually", (done) => {
            const testId = "6234cee80d8ed6196df6dcc7";
            chai
              .request(app)
              .put("/v1/actors/" + testId + "/ban")
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("object");
                expect(res.body).to.have.property("email");
                expect(res.body).to.have.property("isBan").eq(true);
                done();
              });
          });
      });

    /**
    * Test UNBAN route
    */
     describe("PUT (UNBAN) /v1/actors/:id/unban", () => {
        it("Trying to UNBAN an actor Manually", (done) => {
            const testId = "6234cee80d8ed6196df6dcc7";
            chai
              .request(app)
              .put("/v1/actors/" + testId + "/unban")
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("object");
                expect(res.body).to.have.property("email");
                expect(res.body).to.have.property("isBan").eq(false);
                done();
              });
          });
      });

});