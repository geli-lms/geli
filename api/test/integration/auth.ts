import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {User} from '../../src/models/User';
import * as errorCodes from '../../src/config/errorCodes'
import {WhitelistUser} from '../../src/models/WhitelistUser';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../../src/models/Course';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');

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

    it('should pass and enroll into course', async () => {
      const registerUser: IUser = new User();
      registerUser.uid = '5468907';
      registerUser.profile.firstName = 'firstName';
      registerUser.profile.lastName = 'lastName';
      registerUser.role = 'student';
      registerUser.password = 'test1234';
      registerUser.email = 'local@test.local.de';
      const whitelistUser = await WhitelistUser.create({
        uid: registerUser.uid,
        firstName: registerUser.profile.firstName,
        lastName: registerUser.profile.lastName
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
      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(`${BASE_URL}/register`)
          .send(registerUser)
          .end(async (err, res) => {
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
            resultElemCourse.whitelist[0].firstName.should.be.equal(resultElemCourse.students[0].profile.firstName.toLowerCase());
            resultElemCourse.whitelist[0].lastName.should.be.equal(resultElemCourse.students[0].profile.lastName.toLowerCase());
            resolve();
          });
      });
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
})
;

