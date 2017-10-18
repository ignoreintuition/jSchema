(function() {
  // 'use strict';

  function jSchema() {
    var data = [];
    var _schema = {
      tables: {},
      length: 0
    };

    // Add a new table to your schema
    // @namespace jSchema
    // @method add
    // @param {Object} d - a dataset
    // @param {Object} md - metadata about the dataset (name, primaryKey, forignKey)
    _schema.add = function(d, metadata) {
      var name = (metadata && metadata.name) ? metadata.name : "table" + this.length;
      this.tables[name] = {}

      this.tables[name].id = this.length;
      this.tables[name].pk = (metadata && metadata.primaryKey) ? metadata.primaryKey : null;
      this.tables[name].rows = d.length;
      this.tables[name].col = Object.keys(d[0]);
      data.push(d);
      this.length = data.length;
      return this;
    }

    // get a table
    // @namespace jSchema
    // @method get
    // @param {String} d - dataset name
    _schema.get = function(d) {
      if (this.tables[d] === undefined) return null
      else
        return data[this.tables[d].id];
    }

    // join two tables
    // @namespace jSchema
    // @method join
    // @param {String} d1 dataset
    // @param {String} d2 dataset
    // TODO prefix table name to items in object
    // TODO error handling
    _schema.join = function(d1, d2) {
      var self = this;
      var target = []
      data[self.tables[d1].id].forEach(function(obj1) {
        data[self.tables[d2].id].forEach(function(obj2) {
          if (obj1[self.tables[d1].pk] == obj2[self.tables[d1].pk]) {
            obj3 = {};
            for (var attrname in obj1) {
              obj3[attrname] = obj1[attrname];
            }
            for (var attrname in obj2) {
              obj3[attrname] = obj2[attrname];
            }
            target.push(obj3);
          }
        })
      });
      this.add(target, {
        name: d1 + "_" + d2
      })
      return this;
    }

    // drop a table
    // @namespace jSchema
    // @method drop
    // @param {String} d dataset
    _schema.drop = function(d) {
      if (this.tables[d] === undefined) return null
      else {
        data.splice(1, this.tables[d].id);
        delete this.tables[d];
        this.length = data.length;
        return this;
      }
    }

    // sort a table by value
    // @namespace jSchema
    // @method orderBy
    // @param {String} d dataset
    // @param {String} attr the attribute to sort by
    _schema.orderBy = function(d, attr) {
      return data[this.tables[d].id].sort(function(d1, d2) {
        return d1[attr] - d2[attr];
      });
    }

    _schema.groupBy = function() {
      //
    }

    return _schema;
  }

  if (typeof(window.jSchema) === 'undefined') {
    window.jSchema = jSchema();
  }
})();
