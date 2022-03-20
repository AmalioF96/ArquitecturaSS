const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("Applications API", () => {
    /**
   * TEST GET Application
   */
   describe("GET /v1/applications", () => {
    it("Trying to get all data", (done) => {
      chai
        .request(app)
        .get("/v1/applications")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
          done();
        });
    });
  });

  /**
   * TEST POST application
   */
   describe("POST /v1/applications", () => {
    it("Trying to POST an application manually", (done) => {
      const application = {
        moment: "2002-12-09",
        status: "PENDING",
        rejectedReason: "",
        isPaid: false,
        ticker: "ticker",
        comment: ["Buenísimo", "Malísimo"],
        explorer: "6210cce6cf260d99229ec3f7",
        trip: "6210cce6cf260d99229ec3f7"
      };
      chai
        .request(app)
        .post("/v1/applications")
        .send(application)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("status");
          expect(res.body.status).to.equal('PENDING')
          done();
        });
    });
  });

 /**
   * TEST GET (by id) route
   */
  describe("GET /v1/applications/:applicationId", () => {
    it("Trying to GET an application", (done) => {
      const applicationId = "6234cb5e936c0d265b3b017e";
      chai
        .request(app)
        .get("/v1/applications/" + applicationId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("status");
          done();
        });
    });

    it("Trying to GET an application - Error", (done) => {
      const applicationId = "-1";
      chai
        .request(app)
        .get("/v1/applications/" + applicationId)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  
  /**
   * Test DELETE application
   */
   describe("DELETE /v1/applications/:id", () => {
    it("Trying to DELETE an application", (done) => {
      const applicationId = "6234cb5e936c0d265b3b017e";

      chai
        .request(app)
        .delete("/v1/applications/" + applicationId)
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

    /**
   * Test PUT route
   */
     describe("PUT /v1/applications/:id", () => {
        it("Trying to PUT an application Manually", (done) => {
            const testId = "621a15135634db1df716afce";
            const application = {
              moment: "2002-12-10",
              status: "PENDING",
              rejectedReason: "",
              isPaid: false,
              ticker: "ticker",
              comment: ["Buenísimo", "Malísimo"],
              explorer: "6210cce6cf260d99229ec3f7",
              trip: "6210cce6cf260d99229ec3f7"
            };
            chai
              .request(app)
              .put("/v1/applications/" + testId)
              .send(application)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("object");
                expect(res.body).to.have.property("status");
                expect(res.body).to.have.property("moment").eq("2002-12-10T00:00:00.000Z");
                done();
              });
          });
      });

});