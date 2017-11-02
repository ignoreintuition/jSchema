global.window = global;

var assert = require("assert")
var jschema = require("../src/jschema.js");

var s = window.jSchema;
var table = [{"var1": "abc", "var2": 100}, {"var1": "xyz", "var2": 250}]
describe("add", function(){
  it("should return an object of jschema", function(){
    assert.ok(s.add(table));
  });
});
