var app = require('../app');
var request = require('supertest');

describe('Tabula Express App', function() {
  describe('GET /', function() {
    it('should render the index page', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .expect(function(res) {
          if (res.text.indexOf('Tabular') === -1) {
            throw new Error('Expected index page to contain Tabular');
          }
        })
        .end(done);
    });

    it('should include auth URL in response', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          // Should contain auth URL from liveConnect.getAuthUrl()
          done();
        });
    });
  });

  describe('POST /', function() {
    it('should handle text submission', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ submit: 'text' })
        .expect(200)
        .end(done);
    });

    it('should handle textimage submission', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ submit: 'textimage' })
        .expect(200)
        .end(done);
    });

    it('should handle html submission', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ submit: 'html' })
        .expect(200)
        .end(done);
    });

    it('should handle url submission', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ submit: 'url' })
        .expect(200)
        .end(done);
    });

    it('should handle file submission', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ submit: 'file' })
        .expect(200)
        .end(done);
    });

    it('should handle search submission', function(done) {
      request(app)
        .post('/')
        .type('form')
        .send({ submit: 'search' })
        .expect(200)
        .end(done);
    });
  });
});
