import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {User} from '../../src/models/User';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/auth';
const fixtureLoader = new FixtureLoader();

describe('Auth', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`POST ${BASE_URL}/register`, () => {
    it('should fail (email address is already in use)', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user) => {
          const registerUser = user;
          registerUser.uid = '99999999';
          chai.request(app)
            .post(`${BASE_URL}/register`)
            .send(registerUser)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('That email address is already in use');
              done();
            });
        })
        .catch(done);
    });

    it('should fail (matriculation number is already in use)', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user) => {
          const registerUser = user;
          registerUser.email = 'student0815@test.local';
          chai.request(app)
            .post(`${BASE_URL}/register`)
            .send(registerUser)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('That matriculation number is already in use');
              done();
            });
        })
        .catch(done);
    });

    it('should fail (registration as admin)', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const registerUser = user;
          registerUser.email = 'teacher0815@test.local';
          registerUser.role = 'admin';
          chai.request(app)
            .post(`${BASE_URL}/register`)
            .send(registerUser)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('You can only sign up as student or teacher');
              done();
            });
        })
        .catch(done);
    });
  });
});

