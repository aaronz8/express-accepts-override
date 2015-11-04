var app = require('express')();
var bodyParser = require('body-parser');
var request = require('supertest');
var _getQuery = require('../../index')._getQuery;

describe('_getQuery', function() {
  before(function() {
    var options = {
      accepts: ['json', 'html', 'csv', 'txt'], // must be valid mime extensions
      query: 'format', // /path?format=csv
    };

    app.use(bodyParser.json());
    app.use(function(req, res) {
      res.send(_getQuery(req, options));
    });
  });

  it('should not return with no query', function(done) {
    request(app)
      .get('')
      .expect(200, {}, done);
  });

  it('should return modified header with proper query', function(done) {
    request(app)
      .get('?format=html')
      .expect(200, {header: 'text/html'}, done);
  });

  it('should not return with invalid query', function(done) {
    request(app)
      .get('?format=asdf')
      .expect(200, {}, done);
  });
});