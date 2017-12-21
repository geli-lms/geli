import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {User} from '../../src/models/User';
import * as errorCodes from '../../src/config/errorCodes'
import {WhitelistUser} from '../../src/models/WhitelistUser';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../../src/models/Course';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
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
              res.body.message.should.be.equal(errorCodes.errorCodes.mail.duplicate.code);
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
              res.body.message.should.be.equal(errorCodes.errorCodes.duplicateUid.code);
              done();
            });
        })
        .catch(done);
    });

    it('should pass and enroll into course', (done) => {
      const registerUser: IUser = new User();
      registerUser.uid = '5468907';
      registerUser.profile.firstName = 'firstName';
      registerUser.profile.lastName = 'lastName';
      registerUser.role = 'student';
      registerUser.password = 'test1234';
      registerUser.email = 'local@test.local.de';
      WhitelistUser.create({
        uid: registerUser.uid,
        firstName: registerUser.profile.firstName,
        lastName: registerUser.profile.lastName
      }).then((whitelistUser: IWhitelistUser) => {
        Course.create({
          name: 'Test Course 1',
          enrollType: 'whitelist',
          whitelist: []
        }).then((noElemCourse) => {
          Course.create({
            name: 'Test Course 2',
            enrollType: 'whitelist',
            whitelist: [whitelistUser]
          }).then(elemCourse => {
            chai.request(app)
              .post(`${BASE_URL}/register`)
              .send(registerUser)
              .end(async (err, res) => {
                res.status.should.be.equal(204);
                // Get updated Course.
                Course.findById(noElemCourse._id)
                  .populate('whitelist')
                  .populate('students')
                  .then(
                    noElemC => {
                      noElemC.whitelist.length.should.be.equal(0);
                      noElemC.students.length.should.be.equal(0);
                      Course.findById(elemCourse._id)
                        .populate('whitelist')
                        .populate('students')
                        .then(
                          c => {
                            c.whitelist.length.should.be.equal(1);
                            c.students.length.should.be.equal(1);
                            c.whitelist[0].uid.should.be.equal(c.students[0].uid);
                            c.whitelist[0].firstName.should.be.equal(c.students[0].profile.firstName.toLowerCase());
                            c.whitelist[0].lastName.should.be.equal(c.students[0].profile.lastName.toLowerCase());
                            done();
                          })
                    }
                  );
              });
          });
        });
      });
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

