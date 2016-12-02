require("mongodb");
require("../src/mongodb-extension");

var helper = require("./helper");
var should = require("should");

var personId;
var person;
var collection;
var group;

before("#00. Initialize;", function(done) {
    var factory = require("mongo-factory");
    factory.getConnection(process.env.DB_CONNECTIONSTRING)
        .then((db) => {
            collection = db.use("people");
            var people = [];
            group = new Date().getTime().toString();
            for (var i = 0; i < 30; i++) {
                people.push(helper.newData(i + 1, group));
            }
            collection.insertMany(people)
                .then((result) => {
                    done();
                });
        })
        .catch((e) => {
            done(e);
        });
});


it("#01. Should be able to create data", function(done) {
    collection.insert(helper.newData())
        .then((id) => {
            personId = id;
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#02. Should be able to get data by using db.single(criteria)", function(done) {
    collection
        .single({
            _id: personId
        })
        .then((doc) => {
            doc.should.instanceOf(Object);
            person = doc;
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#03. Should error when using db.single(criteria) with no results ", function(done) {
    collection
        .single({
            _id: 0
        })
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#04. Should error when using db.single(criteria) with more than one result", function(done) {
    collection
        .single({
            age: {
                $gt: 0
            }
        })
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#05. Should be able to get data by using db.where(criteria).single()", function(done) {
    collection
        .where({
            _id: person._id
        })
        .single()
        .then((doc) => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#06. Should error when using db.where(criteria).single() with no results ", function(done) {
    collection
        .where({
            _id: 0
        })
        .single()
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#07. Should error when using db.where(criteria).single() with more than one result ", function(done) {
    collection
        .where({
            age: {
                $gt: 0
            }
        })
        .single()
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});


it("#08. Should error when using db.where(criteria).single() more than one result", function(done) {
    collection
        .where({
            age: {
                $gt: 0
            }
        })
        .single()
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#09. Should error when using db.single(criteria) with more than one result", function(done) {
    collection
        .single({
            age: {
                $gt: 0
            }
        })
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#10. Should be able to get data by using db.singleOrDefault(criteria)", function(done) {
    collection
        .singleOrDefault({
            _id: person._id
        })
        .then((doc) => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#11. Should return null using db.singleOrDefault(criteria) with no results ", function(done) {
    collection
        .singleOrDefault({
            _id: 0
        })
        .then((doc) => {
            should.equal(doc, null);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#12. Should error when using db.singleOrDefault(criteria) with more than one result", function(done) {
    collection
        .singleOrDefault({
            age: {
                $gt: 0
            }
        })
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#13. Should be able to get data by using db.where(criteria).singleOrDefault()", function(done) {
    collection
        .where({
            _id: person._id
        })
        .singleOrDefault()
        .then((doc) => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch((e) => {
            done(e);
        });
});


it("#14. Should return null when using db.where(criteria).singleOrDefault() with no results ", function(done) {
    collection
        .where({
            _id: 0
        })
        .singleOrDefault()
        .then((doc) => {
            should.equal(doc, null);
            done();
        })
        .catch((e) => {
            done(e);
        });
});


it("#15. Should error when using db.where(criteria).singleOrDefault() more than one result", function(done) {
    collection
        .where({
            age: {
                $gt: 0
            }
        })
        .singleOrDefault()
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});




it("#16. Should be able to get data by using db.first(criteria)", function(done) {
    collection
        .first({
            age: {
                $gt: 0
            }
        })
        .then((doc) => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#17. Should error when using db.first(criteria) with no results ", function(done) {
    collection
        .first({
            _id: 0
        })
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#18. Should be able to get data by using db.where(criteria).first()", function(done) {
    collection
        .where({
            age: {
                $gt: 0
            }
        })
        .first()
        .then((doc) => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#19. Should error when using db.where(criteria).first() with no results ", function(done) {
    collection
        .where({
            _id: 0
        })
        .first()
        .then((doc) => {
            doc.should.equal(null);
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});


it("#20. Should be able to get data using db.where(criteria).execute() with simple criteria", function(done) {
    collection
        .where({
            age: {
                $gt: 0
            }
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#21. Should be able to get data using db.where(criteria).execute() with logical $and criteria", function(done) {
    collection
        .where({
            $and: [{
                name: person.name
            }, {
                _id: person._id
            }]
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#22. Should only return 2 fields (_id & name)", function(done) {
    collection
        .select(["_id", "name"])
        .first()
        .then((doc) => {
            doc.should.instanceOf(Object);
            if (Object.getOwnPropertyNames(doc).length !== 2) {
                throw new Error("should only have 2 properties");
            }
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#23. Should return all fields when .select(null)", function(done) {
    collection
        .select(null)
        .first({
            group: group
        })
        .then((doc) => {
            doc.should.instanceOf(Object);
            if (Object.getOwnPropertyNames(doc).length !== 8) {
                throw new Error("should only have 8 properties");
            }
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#24. Should update successfuly", function(done) {
    person.name = person.name + "[updated]";
    collection.update(person)
        .then((id) => {
            id.toString().should.equal(person._id.toString());
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#25. Should be able to get updated data successfuly", function(done) {
    collection
        .single({
            _id: personId
        })
        .then((doc) => {
            doc.should.instanceOf(Object);
            var idx = doc.name.indexOf("[updated]");
            idx.should.not.equal(-1);
            person = doc;
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#26. Should be able to delete data successfully", function(done) {
    collection.delete(person)
        .then((result) => {
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#27. Should not be able to get deleted data", function(done) {
    collection
        .single({
            _id: personId
        })
        .then((doc) => {
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#28. Should not be able to get deleted data", function(done) {
    collection
        .single({
            _id: personId
        })
        .then((doc) => {
            done("should have error");
        })
        .catch((e) => {
            done();
        });
});

it("#29. Should be able to get data 20 data order by no asc", function(done) {
    collection
        .where({
            "$and": [{
                no: {
                    $lte: 20
                }
            }, {
                group: group
            }]
        })
        .order({
            no: 1
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            result.data.length.should.equal(20);
            for (var i = 0; i < 20; i++) {
                result.data[i].no.should.equal(i + 1);
            }
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#30. Should be able to get data 20 data order by no desc", function(done) {
    collection
        .where({
            "$and": [{
                no: {
                    $lte: 20
                }
            }, {
                group: group
            }]
        })
        .order({
            no: -1
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            result.data.length.should.equal(20);
            for (var i = 0; i < 20; i++) {
                result.data[i].no.should.equal(20 - i);
            }
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#31. Should be able to get data 10 data when .page(1,10) order by no asc", function(done) {
    collection
        .where({
            "$and": [{
                no: {
                    $lte: 20
                }
            }, {
                group: group
            }]
        })
        .page(1, 10)
        .order({
            no: 1
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            result.data.length.should.equal(10);
            for (var i = 0; i < 10; i++) {
                result.data[i].no.should.equal(i + 1);
            }
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#32. Should be able to get data 6 data when .page(3,7) order by no asc", function(done) {
    collection
        .where({
            "$and": [{
                no: {
                    $lte: 20
                }
            }, {
                group: group
            }]
        })
        .page(3, 7)
        .order({
            no: 1
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            result.data.length.should.equal(6);
            for (var i = 0, off = 15; off < 20; i++, off++) {
                result.data[i].no.should.equal(off);
            }
            done();
        })
        .catch((e) => {
            done(e);
        });
});

it("#32. Should be able to get data 1 data when .page(null,null) order by no asc", function(done) {
    collection
        .where({
            "$and": [{
                no: {
                    $lte: 20
                }
            }, {
                group: group
            }]
        })
        .page(null, null)
        .order({
            no: 1
        })
        .execute()
        .then((result) => {
            result.data.should.instanceOf(Array);
            result.data.length.should.equal(1);
            result.data[0].no.should.equal(1);
            done();
        })
        .catch((e) => {
            done(e);
        });
});
