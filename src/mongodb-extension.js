var Db = require('mongodb').Db;
var Collection = require('mongodb').Collection;
var Query = require('./query');

(function () {

    function single(query) {
        return new Promise((resolve, reject) => {
            if (query)
                this.where(query);

            this.take(2)
                .orderBy([{ _id: -1 }])
                .execute()
                .then(docs => {
                    if (docs.length == 0)
                        reject('no document found');
                    else if (docs.length > 1)
                        reject('expected one doc');
                    else
                        resolve(docs[0]);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
    function singleOrDefault(query) {
        return new Promise((resolve, reject) => {
            this.single(query)
                .then(doc => {
                    resolve(doc);
                })
                .catch(e => {
                    resolve(null);
                })
        })
    }

    function first(query) {
        return new Promise((resolve, reject) => {
            if (query)
                this.where(query);
            this
                .take(1)
                .execute()
                .then(docs => {
                    if (docs.length == 0)
                        reject('no document found');
                    else
                        resolve(docs[0]);
                })
                .catch(e => {
                    reject(e);
                });
        })
    }

    function firstOrDefault(query) {
        return new Promise((resolve, reject) => {
            this.first(query)
                .then(doc => {
                    resolve(doc);
                })
                .catch(e => {
                    resolve(null);
                })
        });
    }

    function insert(doc) {
        return new Promise((resolve, reject) => {
            this
                .insertOne(doc)
                .then(result => {
                    if (result.insertedCount < 1)
                        reject(this.s.name + ": failed to insert");
                    else {
                        var id = result.insertedId;
                        this.single({ _id: id })
                            .then(doc => {
                                resolve(doc);
                            })
                            .catch(e => reject(e));
                    }
                })
                .catch(e => reject(e));
        })
    }

    function query() {
        if (!this._query) {
            this._query = new Query();
        }
        return this._query;
    }

    function execute() {
        return new Promise((resolve, reject) => {
            var query = this.query();
            var projection = {};
                    projection[field] = 1;
                }
                
            var cursor = this.find(query.selector, projection);

            if (query.offset)
                cursor = cursor.skip(query.offset);
            if (query.limit)
                cursor = cursor.limit(query.limit);
            if (query.sort)
                cursor = cursor.sort(query.sort);

            cursor.toArray()
                .then(docs => {
                    resolve(docs);
                })
                .catch(e => reject(e));
        });
    }

    function where(criteria) {
        this.query().where(criteria);
        return this;
    }
    function take(limit) {
        this.query().take(limit);
        return this;
    }
    function skip(skip) {
        this.query().skip(skip);
        return this;
    }
    function page(page, size) {
        this.query().page(page, size);
        return this;
    }
    function orderBy(order) {
        this.query().orderBy(order);
        return this;
    }
    function select(fields) {
        this.query().select(fields);
        return this;
    }
    // Preserve original method with underscore '_' prefix;
    if (Collection.prototype.insert)
        Collection.prototype._insert = Collection.prototype.insert;

    Collection.prototype.insert = insert;
    Collection.prototype.single = single;
    Collection.prototype.singleOrDefault = singleOrDefault;
    Collection.prototype.first = first;
    Collection.prototype.firstOrDefault = firstOrDefault;
    Collection.prototype.query = query;
    Collection.prototype.execute = execute;
    Collection.prototype.where = where;
    Collection.prototype.take = take;
    Collection.prototype.skip = skip;
    Collection.prototype.page = page;
    Collection.prototype.orderBy = orderBy;
    Collection.prototype.select = select;

    Db.prototype.use = function (collectionName) {
        return this.collection(collectionName);
    }
})();