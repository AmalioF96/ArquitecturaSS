const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("Finder API", () => {
  /**
   * TEST POST route
   */
  describe("POST /v1/finders", () => {
    it("Trying to POST a Finder Manually", (done) => {
      const finder = {
        _id: "62235b806cc6e2498c8261c1",
        keyword: "Noche",
        dateStart: "2021-12-09",
        dateEnd: "2021-12-10",
        priceMin: 200,
        priceMax: 2000,
        explorer: "6210d2d91228f387cb58aa5f",
      };
      chai
        .request(app)
        .post("/v1/finders")
        .send(finder)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("explorer");
          done();
        });
    });
  });
  /**
   * TEST POST findTrip route
   */
  describe("POST /v1/finders/findTrip", () => {
    it("Trying to POST a Finder", (done) => {
      const finder = {
        keyword: "velada",
        priceMin: 23,
        priceMax: 200000000,
        explorer: "6210d2d91228f387cb58aa5f",
      };
      chai
        .request(app)
        .post("/v1/finders/findTrip")
        .send(finder)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("keyword");
          expect(res.body).to.have.property("priceMin");
          expect(res.body).to.have.property("priceMax");
          expect(res.body).to.have.property("explorer");
          done();
        });
    });

    it("Trying to POST existing Finder", (done) => {
      const finder = {
        keyword: "velada",
        priceMin: 23,
        priceMax: 200000000,
        explorer: "6210d2d91228f387cb58aa5f",
      };
      chai
        .request(app)
        .post("/v1/finders/findTrip")
        .send(finder)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("keyword");
          expect(res.body).to.have.property("priceMin");
          expect(res.body).to.have.property("priceMax");
          expect(res.body).to.have.property("explorer");
          done();
        });
    });

    it("Trying to POST a Finder and get an error", (done) => {
      chai
        .request(app)
        .post("/v1/finders/findTrip")
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  /**
   * TEST GET route
   */
  describe("GET /v1/finders", () => {
    it("Trying to get all Data", (done) => {
      chai
        .request(app)
        .get("/v1/finders")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
          done();
        });
    });
  });

  /**
   * TEST GET (by id) route
   */
  describe("GET /v1/finders/:id", () => {
    it("Trying to GET a finder", (done) => {
      const testId = "62235b806cc6e2498c8261c1";
      chai
        .request(app)
        .get("/v1/finders/" + testId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("_id");
          done();
        });
    });

    it("Trying to GET Error", (done) => {
      const testId = "-1";
      chai
        .request(app)
        .get("/v1/finders/" + testId)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  /**
   * Test PUT route
   */
  describe("PUT /v1/finders/:id", () => {
    it("Trying to PUT a Finder Manually", (done) => {
      const testId = "62235b806cc6e2498c8261c1";
      const finder = {
        keyword: "Dia",
      };
      chai
        .request(app)
        .put("/v1/finders/" + testId)
        .send(finder)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("keyword");
          expect(res.body).to.have.property("keyword").eq("Dia");
          done();
        });
    });
  });

  /**
   * Test DELETE route
   */
  describe("DELETE /v1/finders/:id", () => {
    it("Trying to DELETE a Finder Manually", (done) => {
      const testId = "62235b806cc6e2498c8261c1";

      chai
        .request(app)
        .delete("/v1/finders/" + testId)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
