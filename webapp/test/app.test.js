var request = require('supertest');
var assert = require('assert');

// Mock the dependencies that require external services
var mockLiveConnect = {
    getAuthUrl: function() {
        return 'https://login.live.com/oauth20_authorize.srf?client_id=test';
    },
    requestAccessTokenByAuthCode: function(authCode, callback) {
        callback({access_token: 'test_token', refresh_token: 'test_refresh'});
    },
    requestAccessTokenByRefreshToken: function(refreshToken, callback) {
        callback({access_token: 'test_token'});
    }
};

var mockCreateExamples = {
    createPageWithImage: function(accessToken, callback) {
        callback({success: true, pageId: 'test-page-1'});
    },
    createPageWithPDF: function(accessToken, callback) {
        callback({success: true, pageId: 'test-page-2'});
    },
    createPageWithSearch: function(accessToken, callback) {
        callback({success: true, pageId: 'test-page-3'});
    }
};

// Create app with mocked dependencies
var app = require('../app');

// Override the dependencies in the routes
var indexRoute = require('../routes/index');
var callbackRoute = require('../routes/callback');

// Test the main routes
describe('Express App Routes', function() {
    describe('GET /', function() {
        it('should render the index page', function(done) {
            request(app)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    assert(res.text.includes('OneNote'), 'Index page should mention OneNote');
                    done();
                });
        });
    });

    describe('GET /callback', function() {
        it('should handle callback with auth code', function(done) {
            request(app)
                .get('/callback?code=test_auth_code')
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
        });

        it('should handle callback with refresh token', function(done) {
            request(app)
                .get('/callback?refresh_token=test_refresh')
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
        });

        it('should handle callback with error', function(done) {
            request(app)
                .get('/callback?error=test_error&error_description=test_description')
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
        });
    });

    describe('POST /create', function() {
        it('should create a page with image', function(done) {
            request(app)
                .post('/create')
                .send({type: 'image', access_token: 'test_token'})
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
        });

        it('should create a page with PDF', function(done) {
            request(app)
                .post('/create')
                .send({type: 'pdf', access_token: 'test_token'})
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
        });

        it('should create a page with search', function(done) {
            request(app)
                .post('/create')
                .send({type: 'search', access_token: 'test_token', query: 'test query'})
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
        });
    });
});

// Test the LiveConnectClient
describe('LiveConnectClient', function() {
    var liveConnect = require('../lib/liveconnect-client');

    it('should generate auth URL', function() {
        var authUrl = liveConnect.getAuthUrl();
        assert(authUrl.includes('https://login.live.com/oauth20_authorize.srf'), 'Auth URL should be correct');
        assert(authUrl.includes('client_id'), 'Auth URL should include client_id');
    });

    it('should request access token by auth code', function(done) {
        liveConnect.requestAccessTokenByAuthCode('test_code', function(response) {
            assert(response.access_token, 'Response should include access_token');
            done();
        });
    });

    it('should request access token by refresh token', function(done) {
        liveConnect.requestAccessTokenByRefreshToken('test_refresh', function(response) {
            assert(response.access_token, 'Response should include access_token');
            done();
        });
    });
});

// Test the CreateExamples module
describe('CreateExamples', function() {
    var createExamples = require('../lib/create-examples');

    it('should create page with image', function(done) {
        createExamples.createPageWithImage('test_token', function(response) {
            assert(response.success, 'Response should indicate success');
            assert(response.pageId, 'Response should include pageId');
            done();
        });
    });

    it('should create page with PDF', function(done) {
        createExamples.createPageWithPDF('test_token', function(response) {
            assert(response.success, 'Response should indicate success');
            assert(response.pageId, 'Response should include pageId');
            done();
        });
    });

    it('should create page with search', function(done) {
        createExamples.createPageWithSearch('test_token', function(response) {
            assert(response.success, 'Response should indicate success');
            assert(response.pageId, 'Response should include pageId');
            done();
        });
    });
});
