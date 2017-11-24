requirejs(["../../dist/jschema.min", "../modules/Table"], function(jSchema, getTable) {
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
