var should = require('should');
var request = require('supertest');
var app = require('../app');

// Test the main app
describe('Tabula Express App', function() {
    
    it('should be an express application', function() {
        should.exist(app);
        app.should.be.type('function');
    });
    
    it('should have port configured', function() {
        var port = app.get('port');
        port.should.be.type('number');
    });
    
    it('should have views directory configured', function() {
        var views = app.get('views');
        should.exist(views);
        views.should.be.type('string');
    });
    
    it('should have jade as view engine', function() {
        app.get('view engine').should.be.type('string');
    });
    
});

// Test routes
describe('Routes', function() {
    
    it('should respond to GET / with 200', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    
});
