requirejs(["../../dist/jschema.min", "../modules/Table"], function(jSchema, getTable) {
  var s = new jSchema({
    "caseSensitive": true
  });
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
        s.join("EDUCATION", "TABLE0", {
          name: "joinTable"
        })
        s.groupBy("TABLE0", {
          dim: "Gender",
          metric: "Count",
          name: "groupBy",
          method: "max",
          percision: 1
        })
        s.insert("TABLE0", [{
          "gender": "Female",
          "age_group": "16-24",
          "count": 10
        }]);
        var content = getTable("EDUCATION", s);
        document.getElementById("target1").insertAdjacentHTML("beforeend", content);
        content = getTable("TABLE0", s);
        document.getElementById("target2").insertAdjacentHTML("beforeend", content);
        content = getTable("JOINTABLE", s);
        document.getElementById("target3").insertAdjacentHTML("beforeend", content);
        content = getTable("TABLE0", s);
        document.getElementById("target4").insertAdjacentHTML("beforeend", content);
        console.log(s);
      })
    )
});
