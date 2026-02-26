var assert = require('assert');
var nock = require('nock');
var liveConnect = require('../lib/liveconnect-client');

// Mock config for testing
var mockConfig = {
    client_id: 'test_client_id',
    client_secret: 'test_client_secret',
    redirect_uri: 'http://localhost:80/callback'
};

// Override config
var originalConfig = require('../config');
require.cache[require.resolve('../config')] = {
    exports: mockConfig
};

describe('LiveConnectClient', function() {
    beforeEach(function() {
        // Clear any pending mocks
        nock.cleanAll();
    });

    describe('getAuthorizationUrl', function() {
        it('should generate correct authorization URL', function() {
            var url = liveConnect.getAuthorizationUrl();
            assert(url.indexOf('https://login.live.com/oauth20_authorize.srf') === 0);
            assert(url.indexOf('client_id=test_client_id') > 0);
            assert(url.indexOf('redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fcallback') > 0);
            assert(url.indexOf('response_type=code') > 0);
        });
    });

    describe('requestAccessToken', function() {
        it('should request access token with correct parameters', function(done) {
            var scope = nock('https://login.live.com')
                .post('/oauth20_token.srf')
                .reply(200, {
                    access_token: 'test_access_token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'test_refresh_token'
                });

            liveConnect.requestAccessToken({
                code: 'test_code',
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:80/callback'
            }, function(err, result) {
                assert.ifError(err);
                assert.equal(result.access_token, 'test_access_token');
                assert.equal(result.token_type, 'bearer');
                scope.done();
                done();
            });
        });
    });

    describe('refreshAccessToken', function() {
        it('should refresh access token using refresh token', function(done) {
            var scope = nock('https://login.live.com')
                .post('/oauth20_token.srf')
                .reply(200, {
                    access_token: 'new_access_token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'new_refresh_token'
                });

            liveConnect.refreshAccessToken('test_refresh_token', function(err, result) {
                assert.ifError(err);
                assert.equal(result.access_token, 'new_access_token');
                scope.done();
                done();
            });
        });
    });
});
