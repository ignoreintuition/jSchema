"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*jshint esversion: 6 */

define(function (require) {
  // "use strict";

  function jSchema() {
    var VERSION = "0.4.3";
    var data = [],
        counter = 0,
        _schema = {
      tables: {},
      length: 0
    };

    // Add a new table to your schema
    // @namespace jSchema
    // @method add
    // @param {Object} d - a dataset
    // @param {Object} md - metadata about the dataset (name, primaryKey)
    // TODO add a unique value to datasets
    _schema.add = function (d, metadata) {
      var _this = this;

      if ((typeof d === "undefined" ? "undefined" : _typeof(d)) != "object") {
        _log(1, d + " is not an object");
        return 0;
      }
      var name = metadata && metadata.name ? metadata.name.toUpperCase() : "TABLE" + counter++;
      if (_checkUnique(name, this.tables) === false) return 0;
      d = _colToUppercase(d);

      this.tables[name] = {};
      this.tables[name].id = data.length;
      this.tables[name].pk = metadata && metadata.primaryKey ? metadata.primaryKey.toUpperCase() : null;
      this.tables[name].rows = d.length;
      this.tables[name].col = Object.keys(d[0]);
      this.tables[name].col.forEach(function (c, i) {
        _this.tables[name].col[i] = c;
      });
      data.push(d);
      this.length = data.length;
      return this;
    };

    // get a table
    // @namespace jSchema
    // @method get
    // @param {String} d - dataset name
    _schema.get = function (d) {
      d = d.toUpperCase();
      if (_checkForTable(d, this.tables) === false) return;
      return data[this.tables[d].id];
    };

    // join two tables
    // @namespace jSchema
    // @method join
    // @param {String} d1 dataset
    // @param {String} d2 dataset
    _schema.join = function (d1, d2, attr) {
      var _this2 = this;

      attr = attr || {};
      d1 = d1.toUpperCase();
      d2 = d2.toUpperCase();
      var target = [];
      if (_checkForTable(d1, this.tables) === false) return;
      if (_checkForTable(d2, this.tables) === false) return;
      data[this.tables[d1].id].forEach(function (left) {
        data[_this2.tables[d2].id].forEach(function (right) {
          if (left[_this2.tables[d1].pk] == right[_this2.tables[d1].pk]) {
            var dest = {};
            for (var attrname in left) {
              dest[d1 + "." + attrname] = left[attrname];
            }
            for (attrname in right) {
              dest[d2 + "." + attrname] = right[attrname];
            }
            target.push(dest);
          }
        });
      });
      this.add(target, {
        name: attr.name || "WORK." + d1 + "_" + d2
      });
      return this;
    };

    // drop a table
    // @namespace jSchema
    // @method drop
    // @param {String} d dataset
    _schema.drop = function (d) {
      d = d.toUpperCase();
      if (_checkForTable(d, this.tables) === false) return;
      data.splice(this.tables[d].id, 1);
      for (var key in this.tables) {
        if (this.tables[key].id > this.tables[d].id) {
          this.tables[key].id -= 1;
        }
      }
      delete this.tables[d];
      this.length = data.length;
      return this;
    };

    // sort a table by value
    // @namespace jSchema
    // @method orderBy
    // @param {String} d dataset
    // @param {String} attr object containing the attribute to sort by & orderBy
    // e.g. {clause: "height, order: "des", name: "tableName"}
    _schema.orderBy = function (d, attr) {
      attr = attr || {};
      if (attr.clause === undefined) return 0;else attr.clause = attr.clause.toUpperCase();

      d = d.toUpperCase();
      if (_checkForTable(d, this.tables) === false) return;
      attr.order = attr.order !== undefined && attr.order.toUpperCase() == "ASC" ? "ASC" : "DESC";
      var orderByData = data[this.tables[d].id].sort(function (d1, d2) {
        return attr.order == "ASC" ? d1[attr.clause] - d2[attr.clause] : d2[attr.clause] - d1[attr.clause];
      });
      this.add(orderByData, {
        name: attr.name || "WORK." + d + "_" + attr.clause + "_" + attr.order,
        primaryKey: attr.clause
      });
      return this;
    };

    // group a table by dimension
    // @namespace jSchema
    // @method groupBy
    // @param {String} d dataset
    // @param {Object} attr dimension to group by and measure to aggregate
    // e.g. {dim: "height, metric: "count", name: "tableName"}
    _schema.groupBy = function (d, attr) {
      attr = attr || {};
      if (attr.dim === undefined || attr.metric === undefined) {
        _log(1, "Must include a dimension and metrics to group by");
        return 0;
      } else {
        attr.dim = attr.dim.toUpperCase();
        attr.metric = attr.metric.toUpperCase();
        attr.method = attr.method || "SUM";
        attr.method = attr.method.toUpperCase();
      }
      var dataset = data[this.tables[d].id];
      var groupByData = _aggregate(dataset, attr.dim, attr.metric, attr.method);
      if (groupByData == 0) return 0;
      this.add(groupByData, {
        name: attr.name || "WORK." + d + "_" + attr.dim + "_" + attr.metric,
        primaryKey: attr.name
      });
      return this;
    };

    // Filter a table by one or more predicates
    // @namespace jSchema
    // @method filter
    // @param {String} d dataset
    // @param {String} predicate
    // @param {String} expression
    // multiple pairs of predicates and expressions can be strung together
    _schema.filter = function (d, clauses) {
      d = d.toUpperCase();
      if (arguments.length < 3 || arguments.length % 2 === 0) {
        _log(1, "Please include table, predicate, and expression");
        return 0;
      }
      var subsetData = data[this.tables[d].id];
      for (var i = 1; i < arguments.length; i += 2) {
        var predicate = arguments[i].toUpperCase(),
            expression = arguments[i + 1];
        subsetData = _filterPredicate(subsetData, predicate, expression);
      }
      this.add(subsetData, {
        name: "WORK." + d + "_" + arguments[1] + "_" + arguments[2]
      });
      return this;
    };

    // update a table with a new dataset
    // @namespace jSchema
    // @method update
    // @param {String} d dataset
    // @param {Object} data new dataset to replace d
    _schema.update = function (d, data) {
      d = d.toUpperCase();
      if (_checkForTable(d, this.tables) === false) return;
      var pk = this.tables[d].pk;
      this.drop(d);
      this.add(data, {
        "name": d,
        "primaryKey": pk
      });
      return this;
    };

    // clean up everything that is in the work namespace
    // @namespace jSchema
    // @method cleanUp
    _schema.cleanUp = function () {
      for (var key in this.tables) {
        if (key.indexOf("WORK.") > -1) {
          this.drop(key);
        }
      }
      return this;
    };
    console.log("jschema.js version " + VERSION + " loaded.");
    return _schema;
  }

  //*********** helper functions ********************

  // returns an array of distinct values
  function _distinct(d, v) {
    var unique = {};
    var arr = [];
    for (var i in d) {
      if (typeof unique[d[i][v]] == "undefined") {
        arr.push(d[i][v]);
      }
      unique[d[i][v]] = "";
    }
    return arr;
  }

  // verifies that a table name is unique in the schema
  function _checkUnique(d, a) {
    for (var key in a) {
      if (key == d) {
        _log(1, name + " already exists in schema");
        return false;
      }
    }
    return true;
  }

  // checks to ensure that a table exists in the schema
  function _checkForTable(d, a) {
    if (a[d] === undefined) {
      _log(1, d + " does not exist in schema.");
      return false;
    } else {
      return true;
    }
  }

  //filters a dataset based on a predicate and value
  function _filterPredicate(data, p, e) {
    var subset = data.filter(function (d) {
      return d[p] == e;
    });
    return subset;
  }

  //converts all columns to uppercase
  function _colToUppercase(d) {
    for (var i = 0; i < d.length; i++) {
      var a = d[i];
      for (var key in a) {
        var temp;
        if (a.hasOwnProperty(key)) {
          temp = a[key];
          delete a[key];
          a[key.toUpperCase()] = temp;
        }
      }
      d[i] = a;
    }
    return d;
  }

  // logging function
  function _log(c, t) {
    var log = ["INFO", "WARNING", "ERROR"],
        logLvl = 0;
    if (c > logLvl) console.log(log[c] + ": " + t);
  }

  // method for aggregating datasets
  // TODO normalize function calls
  function _aggregate(dataset, dim, metric, method) {
    var uniqueDimensions = _distinct(dataset, dim);
    var groupByData = [];
    method = method || "SUM";
    if (["SUM", "COUNT"].indexOf(method) == -1) return 0;
    uniqueDimensions.forEach(function (uniqueDim) {
      var filterDataset = dataset.filter(function (d) {
        return d[dim] == uniqueDim;
      });
      var reducedDataset = null;

      if (method == "SUM") reducedDataset = _sum(uniqueDim, metric, filterDataset);else if (method == "COUNT") reducedDataset = _count(uniqueDim, filterDataset);
      groupByData.push(reducedDataset);
    });
    return groupByData;
  }

  // method for summing values
  function _sum(dim, metric, ds) {
    return ds.reduce(function (a, b) {
      return {
        dim: dim,
        val: a.val + b[metric]
      };
    }, { val: 0 });
  }

  // method for counting values
  function _count(dim, ds) {
    return ds.reduce(function (a, b) {
      return {
        dim: dim,
        val: a.val + 1
      };
    }, { val: 0 });
  }

  return jSchema;
});