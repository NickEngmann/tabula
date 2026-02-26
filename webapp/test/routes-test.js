var assert = require('assert');
var request = require('request');
var app = require('../app');

// Test server setup
var server;
var baseUrl;

before(function(done) {
    server = app.listen(0, function() {
        var port = server.address().port;
        baseUrl = 'http://localhost:' + port;
        done();
    });
});

after(function(done) {
    server.close(done);
});

describe('Routes', function() {
    describe('GET /', function() {
        it('should respond with 200 OK', function(done) {
            request.get(baseUrl + '/', function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });

    describe('GET /callback', function() {
        it('should respond with 200 OK', function(done) {
            request.get(baseUrl + '/callback', function(err, res, body) {
                assert.ifError(err);
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });
});
