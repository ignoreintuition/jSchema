"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*jshint esversion: 6 */
define(function(require) {
  // "use strict";
  function getTable(table, s) {
    var header = `<div class="group">`;
    s.tables[table].col.forEach((d) => {
      header += `<div class="rc header">${d}</div>`
    })
    header += `</div>`
    let rows = ``;
    s.get(table).forEach((d) => {
      rows += `<div class="group">`;
      s.tables[table].col.forEach((e, i) => {
        rows += `<div class="rc">${d[e]}</div>`
      })
      rows += `</div>`;
    })
    return header + rows;
  }
  return getTable;
});
