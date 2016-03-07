const assert = require("assert");
const superagent = require("superagent");
const app = require("../server.js");

// server testing
describe("server", () => {
  var server;

    beforeEach(() => {
      console.log("starting server...");
        server = app().listen(3000);
    });

    afterEach(() => {
      console.log("stopping server...");
        server.close();
    });

    it('prints out "Hello, Meanote!" when user goes to /', (done) => {
      superagent.get('http://localhost:3000/', (error, res) => {
        assert.ifError(error);
        assert.equal(res.status, 200);
        assert.equal(res.text, "Hello, Meanote!");
        done();
      });
    });
  });
