var Db = require("mongodb").Db;
var ObjectId = require("mongodb").ObjectId;
var Collection = require("mongodb").Collection;
var Query = require("./query");

function extension() {

    function single(query, _defaultToNull) {
        if (query) {
            this.where(query);
        }
        return this.take(2)
            .orderBy([{}])
            .execute()
            .then((docs) => {
                if (docs.count === 0) {
                    return _defaultToNull ? Promise.resolve(null) : Promise.reject("no document found in `" + this.s.name + "`");
                }
                else if (docs.count === 1) {
                    return Promise.resolve(docs.data[0]);
                }
                else {
                    return Promise.reject("expected one doc");
                }
            });
    }

    function singleOrDefault(query) {
        return this.single(query, true);
    }

    function first(query, _defaultToNull) {
        if (query) {
            this.where(query);
        }
        return this
            .take(1)
            .execute()
            .then((docs) => {
                if (docs.count === 0) {
                    return _defaultToNull ? Promise.resolve(null) : Promise.reject("no document found in `" + this.s.name + "`");
                }
                else {
                    return Promise.resolve(docs.data[0]);
                }
            })
            .catch((e) => {
                return Promise.reject(e);
            });
    }

    function firstOrDefault(query) {
        return this.first(query, true);
    }

    function insert(doc) {
        return this
            .insertOne(doc)
            .then((result) => {
                if (result.insertedCount < 1) {
                    return Promise.reject(this.s.name + ": failed to insert");
                }
                else {
                    var id = result.insertedId;
                    return Promise.resolve(id);
                }
            });
    }

    function _getDbVersion(doc) {
        var q = {
            _id: ObjectId.isValid(doc._id) ? new ObjectId(doc._id) : null
        };
        return this.single(q)
            .then((dbDoc) => {
                var _doc = Object.assign(dbDoc, doc);
                delete _doc._id;
                return Promise.resolve(_doc);
            });
    }

    function update(doc) {
        var q = {
            _id: ObjectId.isValid(doc._id) ? new ObjectId(doc._id) : null
        };
        return this._getDbVersion(doc)
            .then((dbDoc) => {
                return this.updateOne(q, {
                    $set: dbDoc
                });
            })
            .then((updateResult) => {
                if (updateResult.result.n !== 1 && updateResult.result.ok !== 1) {
                    return Promise.reject("update result not equal 1 or update result is not ok");
                }
                else {
                    return Promise.resolve(q._id);
                }
            });
    }

    function _delete(doc) {
        var q = {
            _id: ObjectId.isValid(doc._id) ? new ObjectId(doc._id) : null
        };
        return this.deleteOne(q)
            .then((deleteResult) => {
                if (deleteResult.result.n !== 1 && deleteResult.result.ok !== 1) {
                    return Promise.reject("delete result not equal 1 or delete result is not ok");
                }
                else {
                    return Promise.resolve(q._id);
                }
            });
    }

    function query() {
        if (!this._query) {
            this._query = new Query();
        }
        return this._query;
    }

    function _load(query) {
        var projection = {};
        // if (query.fields && query.fields instanceof Array) {
        for (var field of query.fields) {
            projection[field] = 1;
        }
        // }
        return this
            .find(query.selector, projection)
            .skip(query.offset)
            .limit(query.limit)
            .sort(query.sort)
            .toArray();
    }

    function execute() {
        var query = this.query();
        return Promise.all([this.find(query.selector).count(), this._load(query)])
            .then((results) => {
                var count = results[0];
                var docs = results[1];

                this._query = null;
                var result = {
                    data: docs,
                    count: docs.length,
                    size: query.limit,
                    total: count,
                    page: query.offset / query.limit + 1
                };
                if (query.fields && query.fields instanceof Array) {
                    result.select = query.fields;
                }
                result.order = query.sort;
                result.filter = query.filter;
                return Promise.resolve(result);
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

    function orderBy(field, asc) {
        this.query().orderBy(field, asc);
        return this;
    }

    function order(order) {
        this.query().order(order);
        return this;
    }

    function select(fields) {
        this.query().select(fields);
        return this;
    }
    // Preserve original method with underscore "_" prefix;
    if (Collection.prototype.insert) {
        Collection.prototype._insert = Collection.prototype.insert;
    }
    Collection.prototype.insert = insert;

    // Preserve original method with underscore "_" prefix;
    if (Collection.prototype.update) {
        Collection.prototype._update = Collection.prototype.update;
    }
    Collection.prototype._getDbVersion = _getDbVersion;
    Collection.prototype.update = update;
    Collection.prototype.delete = _delete;

    Collection.prototype.single = single;
    Collection.prototype.singleOrDefault = singleOrDefault;
    Collection.prototype.first = first;
    Collection.prototype.firstOrDefault = firstOrDefault;
    Collection.prototype.query = query;
    Collection.prototype._load = _load;
    Collection.prototype.execute = execute;
    Collection.prototype.where = where;
    Collection.prototype.take = take;
    Collection.prototype.skip = skip;
    Collection.prototype.page = page;
    Collection.prototype.orderBy = orderBy;
    Collection.prototype.order = order;
    Collection.prototype.select = select;

    Db.prototype.use = function(collectionName) {
        return this.collection(collectionName);
    };
}

extension();
