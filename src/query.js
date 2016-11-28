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

function parsePage(page) {
    if (isNaN(page)) {
        return 0;
    }
    else {
        var _page = parseInt(page, 10);
        return _page - 1;
    }
}

function parseSize(size) {
    if (isNaN(size)) {
        return 1;
    }
    else {
        var _size = parseInt(size, 10);
        return _size;
    }
}

Query.prototype.page = function(page, size) {
    var _page = parsePage(page);
    var _size = parseSize(size);

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
    return this;
};

Query.prototype.select = function(fields) {
    if (!fields instanceof Array) {
        throw Error("fields should be an array of string");
    }
    this.fields = fields;
    return this;
};

module.exports = Query;
