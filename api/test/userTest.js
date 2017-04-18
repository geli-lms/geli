/**
 * Created by Steffen on 18.04.2017.
 */
let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
chai.use(chaiHttp);


describe('User', function () {
  beforeEach(function (done) {
    chai.request(server)
      .post('api/register')
      .send({'firstname': 'Test', 'lastname': 'User', 'email': 'test@example.com', 'password': '1234'})
      .end(function (err, res) {
        console.log('Setup-Error: ' + err);
        console.log('Setup-Result: ' + res);
        done();
      });
  });

  describe('/GET user/roles', function () {
    it('should return an array of roles', function (done) {
      chai.request(server)
        .get('api/user/roles')
        .end(function (err, res) {
          console.log('Error: ' + err);
          console.log('Result: ' + res);
          done();
        })
    })
  });
});