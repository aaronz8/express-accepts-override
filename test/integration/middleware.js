var express = require('express')
var bodyParser = require('body-parser');
var request = require('supertest');
var acceptsOverride = require('../../index');

describe('Middleware', function() {
  var app;

  before(function() {
    app = express();
    app.use(bodyParser.json()); // default options
    app.use(acceptsOverride());
    app.use(function(req, res) {
      res.format({
        'txt': function() {res.send('')},
        'csv': function() {res.send('a,b,c')}
      })
    });
  });

  it('should use first res.format with no suffix, query, header', function(done) {
    request(app)
      .get('')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect(200, '', done);
  });

  it('should use correct res.format with proper suffix', function(done) {
    request(app)
      .get('/test.csv')
      .expect('content-type', 'text/csv; charset=utf-8')
      .expect(200, 'a,b,c', done);
  });

  it('should use first res.format with invalid suffix', function(done) {
    request(app)
      .get('/test.asdf')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect(200, '', done);
  });
});

describe('Middleware incorrect use', function() {
  var app;

  before(function() {
    app = express();
    app.use(bodyParser.json()); // default options
    app.use(acceptsOverride);
    app.use(function(req, res) {
      res.format({
        'txt': function() {res.send('')},
        'csv': function() {res.send('a,b,c')}
      })
    });
  });

  it('should throw error if acceptsOverride mounted incorrectly', function(done) {
    request(app)
      .get('')
      .expect(500, done);
  });
});