# jSchema

![logo](https://user-images.githubusercontent.com/5210420/32085476-48b25564-ba9d-11e7-8a6e-9e2df9cd5ed5.png)

## Data Modeling in JavaScript
jSchema is a framework for modeling data in JavaScript.  By using fundamental data modeling principles you are able to pull multiple datasets into a common schema, define relationships, aggregate, join, and subset datasets to make data easier to work with in the browser.

![entity relationship diagram - new page 1](https://user-images.githubusercontent.com/5210420/32084304-50e6bdbc-ba96-11e7-92b8-cfab13866fe0.png)

jSchema is going to create an object called `jSchema`.  This object is a metadata representation of all your datasets containing the table names, column names, and keys that define sets.  The data itself is stored in a closure within the object and is retrieved via a getter function.  Joining data, aggregating data, and filtering data will create a new dataset in your WORK namespace that will persist on the page until either you delete the table or you run a cleanUp method.  By default jSchema will be case sensitive.  This can be overwritten with:

```JavaScript
var s = new jSchema({
  "caseSensitive": false
});
```

## Demo

A complete working demo of how to load tables, join tables, and aggregate tables can be found in the repository in the demo folder.  A live demo can be found on the libraries homepage: [live demo](http://resurgencewebdesign.com/refugee/)


## How to Use

### NPM
If you use npm, `npm install jschema`.

### requirejs
jschema.js uses requirejs to modularly load the library and is included in the package.json.  requirejs can be moved to the lib directory of your project and included as:

```html
<script data-main="main" src="lib/require.js"></script></body>
```
where main is main.js.  You can then add jSchema to your application as such (in this case main.js):

```JavaScript
requirejs(['lib/jschema'], function(jSchema){
  var s = new jSchema;

  s.add([{a:1, b:2}])
  s.add([{b:2, c:3}], {name:"named_table", primaryKey:"b"})
});
```

Or load data from external sources:

```JavaScript
fetch("education.json")
  .then(response => response.json())
  .then(json => s.add(json, {name:"education", primaryKey:"Age_Group"}))
  .then(fetch("gender.json")
    .then(response => response.json())
    .then(json => s.add(json, {name:"gender", primaryKey:"Age_Group"}))
);
```
### JOIN
Multiple datasets that have primary / foreign key relationships can be joined as such:

```JavaScript
s.join("EDUCATION", "GENDER", {name: "joinTable"})
```

### DROP
You can drop tables that are no longer needed in the schema with the drop method:

```JavaScript
s.drop("GENDER")
```

### SORT
If you want to sort a dataset by an attribute use the orderBy method:

```JavaScript
s.orderBy("GENDER", {
  clause: "Count",
  order: "asc",
  name: "sortBy"
})
```

### GROUP BY
To Group by you need to provide the dataset name, the name of the dimension to group by, and the metrics you wish to aggregate:

```JavaScript
s.groupBy("GENDER", {
  dim: "Gender",
  metric: "Count",
  name: "groupBy",
  method: "sum", // supported methods are sum, count, average, min, max
  percision: 2, // default is 2
  dimName: "GenderPK" // use if you need to rename the dimension
})
```
Output:
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

### FILTER
To filter a dataset you can call the filter method and pass three or more arguments.  First argument is always the table name.  The second and third are the field to filter by, and the value to filter it on.  Additional pairs can be included as fourth, fifth parameters and so on.  A filtered dataset will be created in the WORK namespace.

```JavaScript
s.filter('GENDER', 'Gender', 'Female')
```

### UPDATE
If a new version of the dataset is made available you can update the existing table in the schema by running the update method:

```JavaScript
s.update("GENDER", data);
```

### INSERT
Inserting data into a table will add additional rows to your table.  This will not affect any of the existing data in the table.  A single row can be passed as an object or an array of objects can be passed.  Column names need to match in order for the new data to appear when retrieved.

```JavaScript
s.insert("TABLE0", {
  "gender": "Female",
  "age_group": "16-24",
  "count": 10
});
```

### REMOVE COLUMNS
If you want to completely remove a column use removeCol to create a clone of the table with the column removed.  Pass the dataset as the first argument and the attributes as the second argument.  Attributes are `col` for the column to be removed, and `name` for the name of the table to clone the table to.  Name is optional and if it is not used it will copy the data to the WORK namespace.

```JavaScript
s.removeCol("COMPLETE", {
  "col": "REFUGEES_BY_DEST.STATE",
  "name": "REFUGEES_CLEAN"
});
```

### ADD COLUMNS
In order to add a new column to a dataset you need to call the addCol method.  This will take an expression (two columns and an arithmetic operator) and combine them into a new field.  The function will create a new dataset with the name passed in the attribute `name` , and will return the schema object.  If `name` is not provided it will create a dataset in the WORK namespace.

```JavaScript
s.addCol("REFUGEES_CLEAN", {
  "name": "REFUGEES_ARITHMETIC",
  "expression": "REFUGEES_BY_DEST.VAL / POPULATION.POP_EST_2014",
  "colName": "AVG_POP_DEST"
})
```

By default all temporary datasets (joins, group by, order by) added to the schema will be prefixed with the namespace WORK. (e.g. joining two tables NAMES and LOCATIONS will result in a table added to the schema called WORK.NAMES_LOCATIONS).  Calling the cleanUp method will remove all datasets added to the WORK namespace

```JavaScript
s.cleanUp();
```

# Testing
To run mocha test scripts from the terminal type `npm run test`.

# Contact
Questions, comments, feature requests, etc are always welcome.  I am [@ignoreintuition](https://twitter.com/IgnoreIntuition) on Twitter.
