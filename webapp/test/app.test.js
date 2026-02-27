var request = require('supertest');
var app = require('../app');

describe('Express App', function() {
  it('should respond to GET / with 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should have a title in the response', function(done) {
    request(app)
      .get('/')
      .expect(function(res) {
        if (res.text.indexOf('Tabula') === -1) {
          throw new Error('Expected title not found');
        }
      })
      .end(done);
  });
});
