requirejs(["../dist/jschema"], function(jSchema) {
  var s = new jSchema;
  fetch("data/education.json")
    .then(response => response.json())
    .then(json => s.add(json, {
      name: "education",
      primaryKey: "Age_Group"
    }))
    .then(fetch("data/gender.json")
      .then(response => response.json())
      .then(json => {
        s.add(json)
        s.join("EDUCATION", "TABLE0", {name: "joinTable"})
        s.groupBy("TABLE0", {
          dim: "Gender",
          metric: "Count",
          name: "groupBy",
          method: "average"
        });
        var content = getTable("EDUCATION", s);
        document.getElementById("target1").insertAdjacentHTML("beforeend", content);
        content = getTable("TABLE0", s);
        document.getElementById("target2").insertAdjacentHTML("beforeend", content);
        content = getTable("JOINTABLE", s);
        document.getElementById("target3").insertAdjacentHTML("beforeend", content);
        content = getTable("GROUPBY", s);
        document.getElementById("target4").insertAdjacentHTML("beforeend", content);
        console.log(s);
      })
    )
});

function getTable(table, s){
  var header = ``;
  s.tables[table].col.forEach((d) => {
    header += `<div class="rc header">${d}</div>`
  })
  header += `<br>`
  let rows = ``;
  s.get(table).forEach((d) => {
    s.tables[table].col.forEach((e, i) => {
      rows += `<div class="rc">${d[e]}</div>`
    })
    rows += `<br>`;
  })
  return header + rows;
}
