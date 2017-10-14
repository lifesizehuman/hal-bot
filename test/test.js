var expect = require("chai").expect;

describe("Hal-Bot", function() {
  it("should grab 'twitter' command from a string", function() {
    expect(changeInfo("find twitter of NASA")).to.equal("twitter");
  });
});