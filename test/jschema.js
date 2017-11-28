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
  "var3": "1/1  /1980"
}];
var s;

// set first argument to where you have jSchema.js stored, (e.g. ../lib/jSchema)
requirejs(['../dist/jSchema'],
  function(jSchema) {
    s = new jSchema;
  });

describe("add", function() {
  it("should return an object of jschema", function() {
    assert.ok(s.add(table, {
      name: "t0",
      primaryKey: "var1"
    } ));
  });

  it("should fail to add table to schema (return 0)", function() {
    assert.equal(s.add(""), 0)
  });

  it("should detect existing table in schema (return false)", function() {
    assert.equal(s.add([], {
      name: "t0"
    }), false)
  })
});

describe("get", function() {
  it("should return a table t0", function() {
    assert.equal(table, s.get("t0"));
  });

  it("should fail to return a table t7 (return false)", function() {
    assert.equal(s.get("t7", false));
  });
});

describe("drop", function() {
  it("should return array of length 0", function() {
    s.drop("t0")
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

  it("should group by count", function() {
    s.groupBy("T1", {
      dim: "Var1",
      metric: "Var2",
      method: "COUNT",
      name: "groupByCount"
    })

    assert.equal(s.get("groupByCount").length, 2);
    assert.equal(s.get("groupByCount")[0].VAL, '2.00');
    assert.equal(s.get("groupByCount")[1].VAL, '2.00');
  });

  it("should group by average", function() {
    s.groupBy("T1", {
      dim: "Var1",
      metric: "Var2",
      method: "AVERAGE",
      name: "groupByAverage"
    })

    assert.equal(s.get("groupByAverage").length, 2);
    assert.equal(s.get("groupByAverage")[0].VAL, '125.00');
    assert.equal(s.get("groupByAverage")[1].VAL, '275.00');
  });

  it("should group by max", function() {
    s.groupBy("T1", {
      dim: "Var1",
      metric: "Var2",
      method: "MAX",
      name: "groupByMax"
    })

    assert.equal(s.get("groupByMax").length, 2);
    assert.equal(s.get("groupByMax")[0].VAL, '150.00');
    assert.equal(s.get("groupByMax")[1].VAL, '300.00');
  });

  it("should group by min", function() {
    s.groupBy("T1", {
      dim: "Var1",
      metric: "Var2",
      method: "MIN",
      name: "groupByMin"
    })

    assert.equal(s.get("groupByMin").length, 2);
    assert.equal(s.get("groupByMin")[0].VAL, '100.00');
    assert.equal(s.get("groupByMin")[1].VAL, '250.00');
  });

  it("should fail to group by table due to missin dimensions (return 0)", function() {
    assert.equal(s.groupBy("T1"), 0);
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

  it("should fail to filter a table due to missing arguments (return 0)", function() {
    assert.equal(s.filter("t1", "var1"), 0);
  });
});

describe("orderBy", function() {
  it("should sort a table by ascending value", function() {
    s.orderBy("t1", {
      clause: "var2",
      order: "ASC",
      name: "orderByAsc"
    })

    var result = s.get("orderByAsc")

    for (var i = 0; i < result.length - 2; i++) {
      assert.ok(result[i].VAR2 < result[i+1].VAR2);
    }
  })

  it("should sort a table by descending value", function() {
    s.orderBy("t1", {
      clause: "var2",
      order: "DESC",
      name: "orderByDesc"
    })

    var result = s.get("orderByDesc")

    for (var i = 0; i < result.length - 2; i++) {
      assert.ok(result[i].VAR2 > result[i+1].VAR2);
    }
  })
})

describe("update", function() {
  it("should update a table with a new dataset", function() {
    // Must use JSON to avoid keeping reference to original table
    var beforeUpdate = JSON.parse(JSON.stringify(s.get("t1")))
    var t1 = s.get("t1")

    t1[0].VAR2 = 999
    s.update("t1", t1)

    var afterUpdate = s.get("t1")

    assert.notDeepEqual(beforeUpdate, afterUpdate);
  })
})

describe("insert", function() {
  it("should insert array of objects to table", function() {
    var initialLength = s.get("t1").length

    s.insert("t1", [
      {"var1": "asd", "var2": 1},
      {"var1": "qwe", "var2": 777}
    ])

    var newLength = s.get("t1").length
    assert.ok(newLength == initialLength + 2)
  })
})

describe("cleanUp", function() {
  it("should clean up everything that is in the work namespace", function() {
    var initialLength = s.length
    s.cleanUp()
    var indexOfWork = JSON.stringify(s).indexOf("WORK.")
    var newLength = s.length

    assert.ok((newLength < initialLength) && (indexOfWork === -1))
  })
})
