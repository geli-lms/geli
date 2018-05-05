import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {User} from '../../src/models/User';
import * as errorCodes from '../../src/config/errorCodes';
import {WhitelistUser} from '../../src/models/WhitelistUser';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../../src/models/Course';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import config from '../../src/config/main';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/auth';
const fixtureLoader = new FixtureLoader();

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

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

    it('should fail (register as teacher without teacher email)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const registerUser = teacher;
      registerUser.email = 'teacher@student.local';

      const res = await chai.request(app)
        .post(`${BASE_URL}/register`)
        .send(registerUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.errorCodes.mail.noTeacher.code);
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

    it('should pass', async () => {
      const registerUser = { uid: '5468907',
        firstName: 'firstName',
        lastName: 'lastName',
        role: 'student',
        password: 'test1234',
        email: 'local@test.local.de'};

      const res = await chai.request(app)
        .post(`${BASE_URL}/register`)
        .send(registerUser)
        .catch(err => err.response);

      res.status.should.be.equal(204);
    });


    it('should pass and enroll into course', async () => {
      const registerUser = { uid: '5468907',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'student',
      password: 'test1234',
      email: 'local@test.local.de'};

      const whitelistUser = await WhitelistUser.create({
        uid: registerUser.uid,
        firstName: registerUser.firstName,
        lastName: registerUser.lastName
      });
      const noElemCourse = await Course.create({
        name: 'Test Course 1',
        enrollType: 'whitelist',
        whitelist: []
      });
      const elemCourse = await Course.create({
        name: 'Test Course 2',
        enrollType: 'whitelist',
        whitelist: [whitelistUser]
      });
      const res = await chai.request(app)
          .post(`${BASE_URL}/register`)
          .send(registerUser)
          .catch(err => err.response);

      res.status.should.be.equal(204);
      // Get updated Course.
      const resultNoElemCourse = await Course.findById(noElemCourse._id)
        .populate('whitelist')
        .populate('students');
      const resultElemCourse = await Course.findById(elemCourse._id)
        .populate('whitelist')
        .populate('students');
      resultNoElemCourse.whitelist.length.should.be.equal(0);
      resultNoElemCourse.students.length.should.be.equal(0);
      resultElemCourse.whitelist.length.should.be.equal(1);
      resultElemCourse.students.length.should.be.equal(1);
      resultElemCourse.whitelist[0].uid.should.be.equal(resultElemCourse.students[0].uid);
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
  })
  ;

  describe(`POST ${BASE_URL}/activationresend`, () => {

    it('should fail (user not found)', async () => {
      const user = await FixtureUtils.getRandomUser();
      const resendActivationUser = user;
      resendActivationUser.uid = '99999999';

      const res = await chai.request(app)
        .post(`${BASE_URL}/activationresend`)
        .send({'lastname': resendActivationUser.profile.lastName,
          'uid': resendActivationUser.uid,
          'email': resendActivationUser.email })
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.errorCodes.user.userNotFound.code);
    });

    it('should fail (user already activated)', async () => {
      const user = await FixtureUtils.getRandomActiveStudent();
      const resendActivationUser = user;

      const res = await chai.request(app)
        .post(`${BASE_URL}/activationresend`)
        .send({'lastname': resendActivationUser.profile.lastName,
          'uid': resendActivationUser.uid,
          'email': resendActivationUser.email })
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.errorCodes.user.userAlreadyActive.code);
    });

    // reduce timeTillNextActivationResendMin for testing to 15s
    config.timeTilNextActivationResendMin = 0.25;

    it('should fail (can only send every ' + config.timeTilNextActivationResendMin + ' min)', async () => {
      const student = await FixtureUtils.getRandomInactiveStudent();
      const resendActivationUser = student;

      const res = await chai.request(app)
        .post(`${BASE_URL}/activationresend`)
        .send({'lastname': resendActivationUser.profile.lastName,
          'uid': resendActivationUser.uid,
          'email': resendActivationUser.email })
        .catch(err => err.response);

      res.status.should.be.equal(503);
      res.body.name.should.be.equal('HttpError');
      res.should.have.header('retry-after');
      res.body.message.should.be.equal(errorCodes.errorCodes.user.retryAfter.code);
    });

    it('should fail (email already in use)', async () => {
      await delay(Number(config.timeTilNextActivationResendMin) * 60000);
      const student = await FixtureUtils.getRandomInactiveStudent();
      const resendActivationUser = student;
      const student2 = await FixtureUtils.getRandomActiveStudent();
      const existingUser = student2;
      resendActivationUser.email = existingUser.email;

      const res = await chai.request(app)
        .post(`${BASE_URL}/activationresend`)
        .send({'lastname': resendActivationUser.profile.lastName,
          'uid': resendActivationUser.uid,
          'email': resendActivationUser.email })
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.errorCodes.mail.duplicate.code);
    }).timeout(Number(config.timeTilNextActivationResendMin) * 61000);

    it('should pass', async () => {
      await delay(Number(config.timeTilNextActivationResendMin) * 60000);
      const student = await FixtureUtils.getRandomInactiveStudent();
      const resendActivationUser = student;

      const res = await chai.request(app)
        .post(`${BASE_URL}/activationresend`)
        .send({'lastname': resendActivationUser.profile.lastName,
          'uid': resendActivationUser.uid,
          'email': resendActivationUser.email })
        .catch(err => err.response);

      res.status.should.be.equal(204);
    }).timeout(Number(config.timeTilNextActivationResendMin) * 61000);


  })
  ;
})
;

