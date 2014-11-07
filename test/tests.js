var mocha = require('mocha');
var assert = require('chai').assert;
var request = require('supertest');

var app = require('../server.js');

describe('GET /', function() {
  it('should return html', function(done) {
    request(app)
      .get('/')
      .set('Accept', 'application/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('GET /api/init', function() {
  it('should return JSON', function(done) {
    request(app)
      .get('/api/init')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
