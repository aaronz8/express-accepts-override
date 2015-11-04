var app = require('express')();
var bodyParser = require('body-parser');
var request = require('supertest');
var _getHeader = require('../../index')._getHeader;

describe('_getHeader', function() {
  before(function() {
    app.use(bodyParser.json());
    app.use(function(req, res) {
      res.send({result: _getHeader(req)});
    });
  });

  it('should determine existence of accept header', function(done) {
    request(app)
      .get('')
      .set('Accept', 'something')
      .expect(200, {result: true}, done);
  });
});