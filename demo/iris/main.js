requirejs(["../../dist/jschema.min"], function(jSchema) {
  var s = new jSchema;
  fetch("data/iris.json")
    .then(response => response.json())
    .then(json => s.add(json, {
      name: "iris",
      primaryKey: "id"
    }))
    .then(function() {
      s.groupBy("IRIS", {
        dim: "SPECIES",
        metric: "PETALWIDTHCM",
        name: "SPECIES",
        method: "MAX"
      })
      var content = getTable("SPECIES", s);
      document.getElementById("target1").insertAdjacentHTML("beforeend", content);
      console.log(s);
    });
});

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
