# jSchema
![jschema](https://user-images.githubusercontent.com/5210420/31661268-174230cc-b308-11e7-931c-44d423b80960.png=200x)
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
