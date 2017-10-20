(function() {
  // 'use strict';

  function jSchema() {
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
    // @param {Object} md - metadata about the dataset (name, primaryKey, forignKey)
    _schema.add = function(d, metadata) {
      var name = (metadata && metadata.name) ? metadata.name.toUpperCase() : "TABLE" + counter;
      var self = this;
      this.tables[name] = {};
      this.tables[name].id = counter;
      this.tables[name].pk = (metadata && metadata.primaryKey) ? metadata.primaryKey : null;
      this.tables[name].rows = d.length;
      this.tables[name].col = Object.keys(d[0]);
      this.tables[name].col.forEach(function(c, i){
        self.tables[name].col[i] = c.toUpperCase();
      });
      data.push(d);
      this.length = data.length;
      counter++;
      return this;
    }

    // get a table
    // @namespace jSchema
    // @method get
    // @param {String} d - dataset name
    _schema.get = function(d) {
      d = d.toUpperCase();
      if (this.tables[d] === undefined) return null
      else
        return data[this.tables[d].id];
    }

    // join two tables
    // @namespace jSchema
    // @method join
    // @param {String} d1 dataset
    // @param {String} d2 dataset
    // TODO error handling
    _schema.join = function(d1, d2) {
      d1 = d1.toUpperCase();
      d2 = d2.toUpperCase();
      var self = this;
      var target = []
      data[self.tables[d1].id].forEach(function(obj1) {
        data[self.tables[d2].id].forEach(function(obj2) {
          if (obj1[self.tables[d1].pk] == obj2[self.tables[d1].pk]) {
            obj3 = {};
            for (var attrname in obj1) {
              obj3[d1 + "." + attrname] = obj1[attrname];
            }
            for (var attrname in obj2) {
              obj3[d2 + "." + attrname] = obj2[attrname];
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
    // @param {String} attr object containing the attribute to sort by & orderBy
    // e.g. {name: 'height, order: 'des'}
    _schema.orderBy = function(d, attr ) {
      return data[this.tables[d].id].sort(function(d1, d2) {
        return (attr.order == 'asc') ? d1[attr.name] - d2[attr.name] : d2[attr.name] - d1[attr.name];
      });
    }

    // group a table by dimension
    // @namespace jSchema
    // @method groupBy
    // @param {String} d dataset
    // @param {String} dim dimension to group by
    // @param {String} metric metric to aggregate
    _schema.groupBy = function(d, dim, metric) {
      d = d.toUpperCase();
      var s = data[this.tables[d].id]
      var gb = _distinct(s, dim)
      var reduceArr = []
      gb.forEach(function(a){
        var f = s.filter(function(b){
          return b[dim] == a;
        })
        var fr = f.reduce(function(b, c){
          return {dim: a, val: b.val + c[metric] }
        }, {dim: a, val: 0})
        reduceArr.push(fr);
      })
      return reduceArr;

    }

    _schema.insert = function() {
      //
    }

    _schema.update = function() {
      //
    }

    return _schema;
  }

  //helper functions

  function _distinct(d, v){
    var unique = {}
    var arr = [];
    for( var i in d ){
      if( typeof(unique[d[i][v]]) == "undefined"){
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
