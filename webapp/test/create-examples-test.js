var assert = require('assert');
var nock = require('nock');
var createExamples = require('../lib/create-examples');

// Mock config for testing
var mockConfig = {
    client_id: 'test_client_id',
    client_secret: 'test_client_secret',
    redirect_uri: 'http://localhost:80/callback'
};

// Override config
require.cache[require.resolve('../config')] = {
    exports: mockConfig
};

describe('createExamples', function() {
    beforeEach(function() {
        nock.cleanAll();
    });

    describe('createPageWithSearch', function() {
        it('should create a page with search results', function(done) {
            var accessToken = 'test_access_token';
            
            // Mock OneNote API calls
            var scope1 = nock('https://www.onenote.com')
                .get('/v1.0/myorganization/notebooks')
                .reply(200, {
                    value: [
                        {
                            id: 'notebook-id',
                            displayName: 'Test Notebook'
                        }
                    ]
                });

            var scope2 = nock('https://www.onenote.com')
                .post('/v1.0/notebooks/notebook-id/sections')
                .reply(201, {
                    id: 'section-id',
                    displayName: 'Test Section'
                });

            var scope3 = nock('https://www.onenote.com')
                .post('/v1.0/sections/section-id/pages')
                .reply(201, {
                    id: 'page-id',
                    title: 'Test Page'
                });

            createExamples.createPageWithSearch(accessToken, function(err, result) {
                assert.ifError(err);
                assert(result);
                scope1.done();
                scope2.done();
                scope3.done();
                done();
            });
        });
    });

    describe('createPageWithExamples', function() {
        it('should create a page with examples', function(done) {
            var accessToken = 'test_access_token';
            
            var scope1 = nock('https://www.onenote.com')
                .get('/v1.0/myorganization/notebooks')
                .reply(200, {
                    value: [
                        {
                            id: 'notebook-id',
                            displayName: 'Test Notebook'
                        }
                    ]
                });

            var scope2 = nock('https://www.onenote.com')
                .post('/v1.0/notebooks/notebook-id/sections')
                .reply(201, {
                    id: 'section-id',
                    displayName: 'Test Section'
                });

            var scope3 = nock('https://www.onenote.com')
                .post('/v1.0/sections/section-id/pages')
                .reply(201, {
                    id: 'page-id',
                    title: 'Test Page'
                });

            createExamples.createPageWithExamples(accessToken, function(err, result) {
                assert.ifError(err);
                assert(result);
                scope1.done();
                scope2.done();
                scope3.done();
                done();
            });
        });
    });
});
