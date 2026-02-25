var assert = require('assert');
var sinon = require('sinon');
var request = require('request');
var createExamples = require('../lib/create-examples');

describe('create-examples', function() {
    var requestPostStub;
    var requestGetStub;
    
    beforeEach(function() {
        requestPostStub = sinon.stub(request, 'post');
        requestGetStub = sinon.stub(request, 'get');
    });
    
    afterEach(function() {
        request.post.restore();
        request.get.restore();
    });
    
    describe('createPageWithSearch', function() {
        it('should call createSearch with correct parameters', function(done) {
            var accessToken = 'test-access-token';
            var expectedUrl = 'https://www.onenote.com/api/v1.0/pages?search=tabular&top=100';
            
            // Mock the request response
            requestGetStub.yields(null, { statusCode: 200 }, { id: 'test-page-id' });
            
            createExamples.createPageWithSearch(accessToken, function(err, res, body) {
                assert.ifError(err);
                assert.strictEqual(res.statusCode, 200);
                assert.ok(requestGetStub.calledOnce);
                assert.ok(requestGetStub.calledWithMatch({
                    url: expectedUrl,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                }));
                done();
            });
        });
    });
    
    describe('createPageWithSimpleText', function() {
        it('should create a page with simple text', function(done) {
            var accessToken = 'test-access-token';
            var expectedUrl = 'https://www.onenote.com/api/v1.0/pages';
            
            requestPostStub.yields(null, { statusCode: 201 }, { id: 'test-page-id' });
            
            createExamples.createPageWithSimpleText(accessToken, function(err, res, body) {
                assert.ifError(err);
                assert.strictEqual(res.statusCode, 201);
                assert.ok(requestPostStub.calledOnce);
                assert.ok(requestPostStub.calledWithMatch({
                    url: expectedUrl,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'text/html'
                    }
                }));
                done();
            });
        });
    });
});
