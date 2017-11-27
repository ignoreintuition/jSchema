requirejs(["../../dist/jschema.min", "../modules/Table"], function(jSchema, getTable) {
  var s = new jSchema;
  fetch("data/census-state-populations.json")
    .then(response => response.json())
    .then(json => s.add(json, {
      name: "population",
      primaryKey: "state"
    }))
    .then(function() {
      fetch("data/WRAPS-arrivals-by-destination-2005-2015-clean.json")
        .then(response => response.json())
        .then(json => s.add(json, {
          name: "arrivals",
          primaryKey: "origin"
        }))
        .then(function() {
          s.groupBy("ARRIVALS", {
            dim: "DEST_STATE",
            metric: "ARRIVALS",
            name: "REFUGEES_BY_DEST",
            method: "sum", // supported methods are sum, count, average, min, max
            percision: 2, // default is 2
            dimName: "STATE"
          })
          s.join("POPULATION", "REFUGEES_BY_DEST", {name: "COMPLETE"});
          s.removeCol("COMPLETE", {"col": "REFUGEES_BY_DEST.STATE", "name": "TEST"})
          var content = getTable("TEST", s);
          document.getElementById("target2").insertAdjacentHTML("beforeend", content);
          console.log(s);
        })
    });
});
