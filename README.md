
# mongodb-toolkit
`mongodb-toolkit` is a wrapper library for `mongodb`. this library overrides some method implementation of `mongodb` please refer to overridden methods section for more details.

---
## **Installation**
```
npm install mongodb-toolkit
```
---
## **Usage**
```javascript
var MongoClient = require('mongodb').MongoClient
var url = 'get your connection string';
var db;
MongoClient.connect(url, function(err, connectedDb) { 
	console.log("Connected correctly to server");
	db = connectedDb;
});
```
---
## **Executable methods**
executable methods are methods that will immediately executed against the `query`. See **Query methods** sections.

### execute()
load data with build up query. if no query is build, it will return data with `{}` as criteria.

**returns**
Promise
	
```javascript 
	db
		.execute()
		.then(docs=>{
			// Process your docs here.
		})
		.catch(e=>{
			// Handle your error here.
		});
```	

---
### single(*[selector]*)
get a single data, throw exception if no data returned or the returned data is more than one. If no query is build, it will use`{}` as selector.

**parameters**

 - **selector** - *optional*, `mongodb` [selector syntax][selector-syntax].
		
**returns**
Promise
	
```javascript 
	db
		.single({_id: someId})
		.then(docs=>{
			// Process your docs here.
		})
		.catch(e=>{
			// Handle your error here.
		});
```	
  
---
### singleOrDefault(*[selector]*)
get a single data, throw exception if n returned data is more than one. If no query is build, it will use`{}` as selector.

**parameters**

 - **selector** - *optional*, `mongodb` [selector syntax][selector-syntax].
		
**returns**
Promise
	
```javascript 
	db
		.single({_id: someId})
		.then(docs=>{
			// Process your docs here.
		})
		.catch(e=>{
			// Handle your error here.
		});
```	

---
### first(*[selector]*)
get first data, throw exception if no data returned or the returned data is more than one. If no query is build, it will use`{}` as selector.

**parameters**

 - **selector** - *optional*, `mongodb` [selector syntax][selector-syntax].
		
**returns**
Promise
	
```javascript 
	db
		.first({_id: {$gt:0}})
		.then(docs=>{
			// Process your docs here.
		})
		.catch(e=>{
			// Handle your error here.
		});
```	
 
---
### firstOrDefault(*[selector]*)
get first data, throw exception if n returned data is more than one. If no query is build, it will use`{}` as selector.

**parameters**

 - **selector** - *optional*, `mongodb` [selector syntax][selector-syntax].
		
**returns**
Promise
	
```javascript 
	db
		.firstOrDefault({_id: {$gt:0}})
		.then(docs=>{
			// Process your docs here.
		})
		.catch(e=>{
			// Handle your error here.
		});
```	

---
## **Query methods**
these methods returns `Db` object.  you can chain these methods to build up your query and then call `execute` method to get the result.

### where (*selector*)
query data with selector

**parameters**

 - **selector** - *`mongodb` [selector syntax][selector-syntax]*
	criteria to query.
		
**returns**
Db
	
```javascript 
	db
		.where({})
		.execute()
```	

---
### skip (*offset*)
skip the first N result.

**paramete	rs**

 - **offset** - offset to start return data from.
		
**returns**
Db
	
```javascript 
	db
		.where({})
		.skip(10)
		.take(10)
		.execute()
```	

---
### take (*size*)
set number of results to return.

**parameters**

 - **size** - number of results to get
		
**returns**
Db
	
```javascript 
	db
		.where({})
		.skip(10)
		.take(10)
		.execute()
```	

---
### page (*page* ,*size*)
data pagination, shorthand for `skip` and `take`.

**parameters**

 - **page** - 1 based index.
 - **size** - number of results to get
		
**returns**
Db
	
```javascript 
	db
		.where({})
		.page(2 , 10)
		.execute()
```	

---
### orderBy (sort)
sort results, please refer to [sort syntax][sort-syntax] for more detail.

**parameters**

 - **sort** - `mongodb` sort syntax. 
 
**returns**
Db
	
```javascript 
	db
		.where({})
		.page(2 , 10)
		.execute()
```	

---
### select (fields)
return result with specified fields. `_id` field is always projected, please refer to mongodb [projection][projection].

**parameters**

 - **fields** - array of string. 
 
**returns**
Db
	
```javascript 
	db
		.where({})
		.page(2 , 10)
		.select(['id', 'name', 'age'])
		.execute()
```	

---

## **Insert, Update, Delete**

### insert (doc)
return newly created document `_id`.

**parameters**

 - **doc** - document to be inserted. 
 
**returns**
Promise, resolving `_id` of inserted document.
	
```javascript 
	db
		.insert(doc)
		.then(result=>{
			//result is newly created document `_id`
	})
```	

---
### update (doc)
return updated document `_id`.

**parameters**

 - **doc** - document to be updated, must contains `_id`  field
 
**returns**
Promise, resolving `_id` of updated document.
	
```javascript 
	db
		.update(doc)
		.then(result=>{
			//result is updated document `_id` .
	})
```	

---
### delete (doc)
return deleted document `_id`.

**parameters**

 - **doc** - document to be deleted, must contains `_id`  field
 
**returns**
Promise, resolving `_id` of deleted document.
	
```javascript 
	db
		.delete(doc)
		.then(result=>{
			//result is deleted document `_id` .
	})
```	
---
## **Overridden methods**
here is a list of overridden methods by this library. you can always use `mongodb` implementation by prefixing the method with underscore `_`

- **insert** - *use **_insert** to use `mongodb` implementation*.

---
## **Dependencies**
- [mongodb][mongodb]
[mongodb]:https://github.com/mongodb/node-mongodb-native
[selector-syntax]:http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#find
[sort-syntax]:http://mongodb.github.io/node-mongodb-native/2.1/api/Cursor.html#sort
[projection]:https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/