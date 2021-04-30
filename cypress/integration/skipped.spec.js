const assert = require("assert");

describe.skip("Skipped", () => {
  it("is skipped", () => {
    assert.equal("true", "false");
  });

  it("is also skipped", () => {
    assert.equal("true", "false");
  });

  it("is skipped too.", () => {
    assert.equal("true", "false");
  });
});

xdescribe("XSkipped", () => {
  it("is skipped", () => {
    assert.equal("true", "false");
  });

  it("is also skipped", () => {
    assert.equal("true", "false");
  });

  it("is skipped too.", () => {
    assert.equal("true", "false");
  });
});