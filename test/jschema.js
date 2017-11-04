var assert = require("assert")
var requirejs = require("requirejs");

requirejs.config({
  baseUrl: 'src',
  nodeRequire: require
});

var table = [{
  "var1": "abc",
  "var2": 100
}, {
  "var1": "xyz",
  "var2": 250
}];
var s;

requirejs(['jschema'],
function (jSchema) {
  s = new jSchema;
});

describe("add", function() {
  it("should return an object of jschema", function() {
    assert.ok(s.add(table));
  });
});
