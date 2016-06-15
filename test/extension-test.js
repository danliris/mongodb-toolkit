var helper = require('./helper');
var should = require('should');
var mongo = require('mongodb');
require('../src/mongodb-extension');


var collection;
before('#00. Initialize;', function (done) {
    var factory = require('mongo-factory');
    factory.getConnection(process.env.DB_CONNECTIONSTRING)
        .then(db => {
            collection = db.use('people');
            done();
        });
});


it('#01. Should be able to create data', function (done) {
    collection.insert(helper.newData())
        .then(doc => {
            person = doc;
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#02. Should be able to get data by using db.single(criteria)', function (done) {
    collection
        .single({ _id: person._id })
        .then(doc => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#03. Should be able to get data by using db.where(criteria).single()', function (done) {
    collection
        .where({ _id: person._id })
        .single()
        .then(doc => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#04. Should error when using db.where(criteria).single() with no results ', function (done) {
    collection
        .where({ _id: 0 })
        .single()
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#05. Should error when using db.single(criteria) with no results ', function (done) {
    collection
        .single({ _id: 0 })
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})


it('#06. Should error when using db.where(criteria).single() more than one result', function (done) {
    collection
        .where({ _id: { $gt: 0 } })
        .single()
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#07. Should error when using db.single(criteria) with more than one result', function (done) {
    collection
        .single({ _id: { $gt: 0 } })
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#08. Should be able to get data by using db.first(criteria)', function (done) {
    collection
        .first({ age: { $gt: 0 } })
        .then(doc => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#09. Should be able to get data by using db.where(criteria).first()', function (done) {
    collection
        .where({ age: { $gt: 0 } })
        .first()
        .then(doc => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#10. Should error when using db.where(criteria).first() with no results ', function (done) {
    collection
        .where({ _id: 0 })
        .first()
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#11. Should error when using db.first(criteria) with no results ', function (done) {
    collection
        .first({ _id: 0 })
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#12. Should be able to get data by using db.singleOrDefault(criteria)', function (done) {
    collection
        .singleOrDefault({ _id: person._id })
        .then(doc => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#13. Should be able to get data by using db.where(criteria).singleOrDefault()', function (done) {
    collection
        .where({ _id: person._id })
        .singleOrDefault()
        .then(doc => {
            doc.should.instanceOf(Object);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#14. Should return null when using db.where(criteria).singleOrDefault() with no results ', function (done) {
    collection
        .where({ _id: 0 })
        .singleOrDefault()
        .then(doc => {
            should.equal(doc, null);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#15. Should return null using db.singleOrDefault(criteria) with no results ', function (done) {
    collection
        .singleOrDefault({ _id: 0 })
        .then(doc => {
            should.equal(doc, null);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#16. Should error when using db.where(criteria).singleOrDefault() more than one result', function (done) {
    collection
        .where({ _id: { $gt: 0 } })
        .singleOrDefault()
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#17. Should error when using db.singleOrDefault(criteria) with more than one result', function (done) {
    collection
        .singleOrDefault({ _id: { $gt: 0 } })
        .then(doc => {
            doc.should.equal(null);
            done('should have error');
        })
        .catch(e => {
            done();
        })
})

it('#18. Should be able to get data using db.where(criteria).execute() with simple criteria', function (done) {
    collection
        .where({ name: 'some name' })
        .execute()
        .then(doc => {
            doc.should.instanceOf(Array);
            done();
        })
        .catch(e => {
            done(e);
        })
})

it('#19. Should be able to get data using db.where(criteria).execute() with logical $and criteria', function (done) {
    collection
        .where({ $and: [{ name: person.name }, { _id: person._id }] })
        .execute()
        .then(doc => {
            doc.should.instanceOf(Array);
            done();
        })
        .catch(e => {
            done(e);
        })
})
