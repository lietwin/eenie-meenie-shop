const assert = require("assert");
describe("my feature", () =>{
  it("works", () => {
    assert.equal("A", "A");
  });

  it("fails gracefully", ()=>{
    assert.throws(()=>{
      throw "Error";
    });
  });
});

describe("my other feature", () => {
  it("async", ()=>{
    setTimeout(()=>{
      done();
    }, 25);
  });
});
