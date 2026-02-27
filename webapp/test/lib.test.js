var should = require('should');

// Test liveconnect-client
var liveConnect = require('../lib/liveconnect-client');

describe('LiveConnect Client', function() {
    
    it('should be an object', function() {
        liveConnect.should.be.type('object');
    });
    
    it('should export required functions', function() {
        liveConnect.should.have.property('getAuthUrl');
        liveConnect.should.have.property('requestAccessTokenByAuthCode');
        liveConnect.should.have.property('requestAccessTokenByRefreshToken');
    });
    
    it('getAuthUrl should return a string with authorization URL', function() {
        var authUrl = liveConnect.getAuthUrl();
        authUrl.should.be.type('string');
        authUrl.should.containEql('https://login.live.com/oauth20_authorize.srf');
    });
    
});

// Test create-examples
var createExamples = require('../lib/create-examples');

describe('Create Examples', function() {
    
    it('should be an object', function() {
        createExamples.should.be.type('object');
    });
    
    it('should export required functions', function() {
        createExamples.should.have.property('createPageWithSearch');
        createExamples.should.have.property('createPageWithSimpleText');
        createExamples.should.have.property('createPageWithTextAndImage');
    });
    
});
