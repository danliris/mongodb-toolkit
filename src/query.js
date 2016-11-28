var Query = function() {
    this.selector = {};
    this.sort = {};
    this.offset = 0;
    this.limit = 0;
    this.fields = [];
};

Query.prototype.where = function(criteria) {
    this.selector = criteria;
    return this;
};

Query.prototype.take = function(limit) {
    this.limit = limit < 0 ? 0 : limit;
    return this;
};

Query.prototype.skip = function(offset) {
    this.offset = offset < 0 ? 0 : offset;
    return this;
};

Query.prototype.page = function(page, size) {
    var _page = (parseInt(page || "0", 10) - 1) < 0 ? 0 : (parseInt(page || "0", 10) - 1);
    var _size = parseInt(size || "1", 10) < 1 ? 1 : parseInt(size || "1", 10);

    this.skip(_page * _size).take(_size);
    return this;
};

Query.prototype.orderBy = function(field, asc) {
    this.sort = {};
    this.sort[field] = (asc || "true").toString().toLowerCase() === "true" ? 1 : -1;
    return this;
};

Query.prototype.order = function(order) {
    this.sort = order;
    // this.sort[field] = (asc || "true").toString().toLowerCase() === "true" ? 1 : -1;;
    return this;
};

Query.prototype.select = function(fields) {
    if (!fields instanceof Array) {
        throw Error("fields should be an array of string");
    }
    this.fields = fields;
    return this;
};

Query.prototype.index = function(index) {
    this.use_index = index;
    return this;
};


module.exports = Query;
