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
  "var1": "abc",
  "var2": 150
}, {
  "var1": "xyz",
  "var2": 250
}, {
  "var1": "xyz",
  "var2": 300
}];

var table2 = [{
  "var1": "abc",
  "var3": "1/1/1978"
}, {
  "var1": "xyz",
  "var3": "1/1/1980"
}];
var s;

requirejs(['jschema'],
  function(jSchema) {
    s = new jSchema;
  });

describe("add", function() {
  it("should return an object of jschema", function() {
    assert.ok(s.add(table));
  });
});

describe("get", function() {
  it("should return a table table0", function() {
    assert.equal(table, s.get("table0"));
  });
});

describe("drop", function() {
  it("should return array of length 0", function() {
    s.drop("table0")
    assert.equal(s.length, 0);
  });
});

describe("groupBy", function() {
  it("should group by table", function() {
    s.add(table, {
      name: "t1",
      primaryKey: "var1"
    });
    s.groupBy("T1", {
      dim: "Var1",
      metric: "Var2",
      name: "groupBy"
    })

    assert.equal(s.get("groupBy").length, 2);
    assert.equal(s.get("groupBy")[0].VAL, 250);
  });
});

describe("join", function() {
  it("should join two tables", function() {
    s.add(table2, {name: "t2"})
    s.join("t1", "t2", {name: "joinTable"})
    assert.equal(s.get("joinTable").length, 4);
  });
});

describe("filter", function() {
  it("should filter a table", function() {
    s.filter("t1", "var1", "abc")
    assert.equal(s.get("work.t1_var1_abc").length, 2);
  });
});
