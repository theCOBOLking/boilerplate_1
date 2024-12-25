const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
    1) Convert a valid input such as 10L: GET request to /api/convert.
    2) Convert an invalid input such as 32g: GET request to /api/convert.
    3) Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert.
    4) Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert.
    5) Convert with no number such as kg: GET request to /api/convert.
  */

  test('1) Convert a valid input such as 10L', function(done) {
    chai.request(server)
      .get('/api/convert?input=10L')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        // Check the response structure
        assert.property(res.body, 'initNum');
        assert.property(res.body, 'initUnit');
        assert.property(res.body, 'returnNum');
        assert.property(res.body, 'returnUnit');
        assert.property(res.body, 'string');
        
        assert.equal(res.body.initNum, 10);
        assert.equal(res.body.initUnit, 'L');
        // The conversion L -> gal is ~2.64172
        // If you want to check approximate numeric equality, uncomment below:
        // assert.approximately(res.body.returnNum, 2.64172, 0.1);

        done();
      });
  });

  test('2) Convert an invalid input such as 32g', function(done) {
    chai.request(server)
      .get('/api/convert?input=32g')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        // For invalid unit, we expect { error: 'invalid unit' }
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'invalid unit');
        done();
      });
  });

  test('3) Convert an invalid number such as 3/7.2/4kg', function(done) {
    chai.request(server)
      .get('/api/convert?input=3/7.2/4kg')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        // For invalid number, we expect { error: 'invalid number' }
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'invalid number');
        done();
      });
  });

  test('4) Convert an invalid number AND unit such as 3/7.2/4kilomegagram', function(done) {
    chai.request(server)
      .get('/api/convert?input=3/7.2/4kilomegagram')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        // For invalid number and unit, we expect { error: 'invalid number and unit' }
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'invalid number and unit');
        done();
      });
  });

  test('5) Convert with no number such as kg', function(done) {
    chai.request(server)
      .get('/api/convert?input=kg')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        // With no number, default to 1 => initNum: 1
        assert.equal(res.body.initNum, 1);
        assert.equal(res.body.initUnit, 'kg');
        // kg -> lbs is about 2.20462
        // If you want to check approximate numeric equality, uncomment below:
        // assert.approximately(res.body.returnNum, 2.20462, 0.1);
        assert.equal(res.body.returnUnit, 'lbs');
        assert.property(res.body, 'string');
        done();
      });
  });

});
