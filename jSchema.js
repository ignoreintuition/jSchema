(function() {
  // 'use strict';

  function jSchema() {
    var version = '0.1.1';
    data = [],
      counter = 0,
      _schema = {
        tables: {},
        length: 0
      };

    // Add a new table to your schema
    // @namespace jSchema
    // @method add
    // @param {Object} d - a dataset
    // @param {Object} md - metadata about the dataset (name, primaryKey, forignKey)
    _schema.add = function(d, metadata) {
      if (typeof d != "object") {
        console.log("Warning:" + d + " is not an object")
        return;
      }
      var name = (metadata && metadata.name) ? metadata.name.toUpperCase() : "TABLE" + counter;
      var self = this;
      this.tables[name] = {};
      this.tables[name].id = counter;
      this.tables[name].pk = (metadata && metadata.primaryKey) ? metadata.primaryKey : null;
      this.tables[name].rows = d.length;
      this.tables[name].col = Object.keys(d[0]);
      this.tables[name].col.forEach(function(c, i) {
        self.tables[name].col[i] = c;
      });
      data.push(d);
      this.length = data.length;
      counter++;
      return this;
    };

    // get a table
    // @namespace jSchema
    // @method get
    // @param {String} d - dataset name
    _schema.get = function(d) {
      d = d.toUpperCase();
      if (this.tables[d] === undefined) {
        console.log("Warning: " + d + " does not exist in schema.");
        return;
      } else
        return data[this.tables[d].id];
    };

    // join two tables
    // @namespace jSchema
    // @method join
    // @param {String} d1 dataset
    // @param {String} d2 dataset
    _schema.join = function(d1, d2) {
      d1 = d1.toUpperCase();
      d2 = d2.toUpperCase();
      if (!self.tables[d1] || !self.tables[d2]) {
        console.log("Warning: Table doesn't exist in schema")
        return;
      }
      var self = this,
        target = [];
      data[self.tables[d1].id].forEach(function(left) {
        data[self.tables[d2].id].forEach(function(right) {
          if (left[self.tables[d1].pk] == right[self.tables[d1].pk]) {
            dest = {};
            for (var attrname in left) {
              dest[d1 + "." + attrname] = left[attrname];
            }
            for (var attrname in right) {
              dest[d2 + "." + attrname] = right[attrname];
            }
            target.push(dest);
          }
        })
      });
      this.add(target, {
        name: "WORK." + d1 + "_" + d2
      })
      return this;
    };

    // drop a table
    // @namespace jSchema
    // @method drop
    // @param {String} d dataset
    _schema.drop = function(d) {
      d = d.toUpperCase();
      if (this.tables[d] === undefined) {
        console.log("Warning: " + d + " does not exist in schema")
        return;
      }
      data.splice(1, this.tables[d].id);
      delete this.tables[d];
      this.length = data.length;
      return this;
    };

    // sort a table by value
    // @namespace jSchema
    // @method orderBy
    // @param {String} d dataset
    // @param {String} attr object containing the attribute to sort by & orderBy
    // e.g. {name: 'height, order: 'des'}
    _schema.orderBy = function(d, attr) {
      d = d.toUpperCase();
      if (this.tables[d] === undefined) {
        console.log("Warning: " + d + " does not exist in schema")
        return;
      }
      attr.order = (attr.order != undefined && attr.order.toUpperCase() == 'ASC') ? 'ASC' : 'DESC';
      var orderByData = data[this.tables[d].id].sort(function(d1, d2) {
        return (attr.order == 'ASC') ? d1[attr.name] - d2[attr.name] : d2[attr.name] - d1[attr.name];
      });
      this.add(orderByData, {
        name: "WORK." + d + "_" + attr.name + "_" + attr.order
      });
      return this;
    };

    // group a table by dimension
    // @namespace jSchema
    // @method groupBy
    // @param {String} d dataset
    // @param {String} dim dimension to group by
    // @param {String} metric metric to aggregate
    _schema.groupBy = function(d, dim, metric) {
      d = d.toUpperCase();
      var dataset = data[this.tables[d].id],
        uniqueDimensions = _distinct(dataset, dim),
        groupByData = [];
      uniqueDimensions.forEach(function(ud) {
        var filterDataset = dataset.filter(function(d) {
          return d[dim] == ud;
        });
        var reducedDataset = filterDataset.reduce(function(a, b) {
          return {
            dim: ud,
            val: a.val + b[metric]
          }
        }, {
          dim: ud,
          val: 0
        });
        groupByData.push(reducedDataset);
      });
      this.add(groupByData, {
        name: "WORK." + d + "_" + dim + "_" + metric
      });
      return this;
    };

    _schema.insert = function() {
      //
    };

    _schema.update = function() {
      //
    };

    _schema.cleanUp = function(){
      //
    }

    return _schema;
  };

  //helper functions
  function _distinct(d, v) {
    var unique = {}
    var arr = [];
    for (var i in d) {
      if (typeof(unique[d[i][v]]) == "undefined") {
        arr.push(d[i][v]);
      }
      unique[d[i][v]] = "";
    }
    return arr;
  };

  if (typeof(window.jSchema) === 'undefined') {
    window.jSchema = jSchema();
  }
})();
