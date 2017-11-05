requirejs(['../dist/jschema'], function(jSchema){
  //s.add([{a:1, b:2}])
  //s.add([{b:2, c:3}], {name:"named_table", primaryKey:"b"})
  var s = new jSchema;
  fetch("data/education.json")
  .then(response => response.json())
  .then(json => s.add(json, {
    name: "education",
    primaryKey: "Age_Group"
  }))
  .then(fetch("data/gender.json")
    .then(response => response.json())
    .then(json => s.add(json ))
    .then(f => console.log(s))
  )
  // .then(function(){
  //   document.getElementById("target").innerHTML = s.get("education");
  // })
});
