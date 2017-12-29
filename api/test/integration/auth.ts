import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import chaiHttp = require('chai-http');
import * as errorCodes from '../../src/config/errorCodes'
import {FixtureUtils} from '../../fixtures/FixtureUtils';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/auth';
const fixtureLoader = new FixtureLoader();

describe('Auth', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}/register`, () => {
    it('should fail (email address is already in use)', async () => {
      const user = await FixtureUtils.getRandomUser();
      const registerUser = user;
      registerUser.uid = '99999999';

      const res = await chai.request(app)
        .post(`${BASE_URL}/register`)
        .send(registerUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.errorCodes.mail.duplicate.code);
    });

    it('should fail (matriculation number is already in use)', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const registerUser = student;
      registerUser.email = 'student0815@neu.local';

      const res = await chai.request(app)
        .post(`${BASE_URL}/register`)
        .send(registerUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.errorCodes.duplicateUid.code);
    });

    it('should fail (registration as admin)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const registerUser = teacher;
      registerUser.email = 'teacher0815@test.local';
      registerUser.role = 'admin';

      const res = await chai.request(app)
        .post(`${BASE_URL}/register`)
        .send(registerUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('You can only sign up as student or teacher');
    });
  });
});

