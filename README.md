# jSchema
Data Modeling in JavaScript

jSchema is a framework for modeling data in JavaScript.  By using fundamental data modeling principles you are able to pull multiple datasets
into in a common schema, assign primary / foreign key relationships, aggregate, join, and subset datasets to make data easier to work with
in the browser.

## How to Use
jSchema is going to create an object assigned globally to the window called `window.jSchema`.  You can then add dataset directly

```Javascript
var s =  window.jSchema
s.add([{a:1, b:2}])
s.add([{b:2, c:3}], {name:"named_table", primaryKey:"b"})
```

Or load data from external sources

```Javascript
fetch("education.json")
  .then(response => response.json())
  .then(json => s.add(json, {name:"education", primaryKey:"Age_Group"}))
  .then(fetch("gender.json")
    .then(response => response.json())
    .then(json => s.add(json, {name:"gender", primaryKey:"Age_Group"}))
);
```

Multiple datasets that have primary / foreign key relationships can be joined as such:

```Javascript
s.join("education", "gender")
```

You can drop tables that are no longer needed in the schema with the drop method

```Javascript
s.drop("gender")
```

If you want to sort a dataset by an attribute use the orderBy method:

```Javascript
s.orderBy('education', "Count")
```

To Group by you need to provide the dataset name, the name of the dimension to group by, and the metrics you wish to aggregate:

```Javascript
s.groupBy("GENDER", "Gender", "Count")
```
Output
```JSON [
  {
    "dim": "Male",
    "val": 37575
  },
  {
    "dim": "Female",
    "val": 44074
  }
]
```
