var assert = require('assert');

// Test basic module imports
describe('Application Modules', function() {
    it('should load express', function() {
        var express = require('express');
        assert(express);
        assert(typeof express === 'function');
    });

    it('should load app.js', function() {
        var app = require('../app');
        assert(app);
        assert(typeof app === 'object');
    });

    it('should have routes', function() {
        var routes = require('../routes/index');
        assert(routes);
        assert(typeof routes === 'object');
    });
});

// Test LiveConnectClient
describe('LiveConnectClient', function() {
    it('should be loadable', function() {
        var liveConnect = require('../lib/liveconnect-client');
        assert(liveConnect);
    });
});

// Test createExamples
describe('createExamples', function() {
    it('should be loadable', function() {
        var createExamples = require('../lib/create-examples');
        assert(createExamples);
    });
});
