import * as chai from 'chai';
import * as request from 'superagent';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {errorCodes} from '../../src/config/errorCodes';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {IUser} from '../../../shared/models/IUser';
import {allRoles} from '../../src/config/roles';
import chaiHttp = require('chai-http');
import fs = require('fs');

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/users';
const ROLE_URL = BASE_URL + '/roles';
const Search_URL = BASE_URL + '/members/search';
const fixtureLoader = new FixtureLoader();

describe('User', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, () => {
    it('should return all users', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`);

      res.status.should.be.equal(200);
      res.body.should.be.a('array');
      res.body.length.should.be.equal(await FixtureUtils.getUserCount());
    });

    it('should fail with wrong authorization', async () => {

      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);

      res.status.should.be.equal(401);
    });

    it('should return the requested user object', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .get(`${BASE_URL}/${admin._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`);

      res.status.should.be.equal(200);
      res.body._id.should.be.equal(admin._id.toString());
      res.body.email.should.be.equal(admin.email);
    });
  });

  describe(`GET ${ROLE_URL}`, () => {
    it('should fail with permission denied', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const res = await chai.request(app)
        .get(ROLE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`)
        .catch(err => err.response);

      res.status.should.be.equal(403);
    });

    it('should return an array with the defined roles', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .get(ROLE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`);

      res.status.should.be.equal(200);
      res.body.should.be.a('array');
      res.body.length.should.be.equal(allRoles.length);
      res.body.should.have.same.members(allRoles);
    });
  });

  describe(`GET ${Search_URL}`, () => {
    it('should search for a student', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const newUser: IUser = new User({
        uid: '487895',
        email: 'test@local.tv',
        password: 'test123456',
        profile: {
          firstName: 'Max',
          lastName: 'Mustermann'
        },
        role: 'student'
      });
      const createdUser = await User.create(newUser);
      const res = await chai.request(app)
        .get(Search_URL)
        .query({
          role: newUser.role,
          query: newUser.uid +
          ' ' + newUser.email +
          ' ' + newUser.profile.firstName +
          ' ' + newUser.profile.lastName,
          limit: 1
        })
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`);

      res.status.should.be.equal(200);
      res.body.meta.count.should.be.greaterThan(0);
      res.body.users.length.should.be.greaterThan(0);
      res.body.users[0].profile.firstName.should.be.equal(newUser.profile.firstName);
      res.body.users[0].profile.firstName.should.be.equal(newUser.profile.firstName);
      res.body.users[0].uid.should.be.equal(newUser.uid);
      res.body.users[0].email.should.be.equal(newUser.email);
    });

    it('should search for a teacher', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const newUser: IUser = new User({
        uid: '487895',
        email: 'test@local.tv',
        password: 'test123456',
        profile: {
          firstName: 'Max',
          lastName: 'Mustermann'
        },
        role: 'teacher'
      });
      const createdUser = await User.create(newUser);
      const res = await chai.request(app)
        .get(Search_URL)
        .query({
          role: 'teacher',
          query: newUser.uid +
          ' ' + newUser.email +
          ' ' + newUser.profile.firstName +
          ' ' + newUser.profile.lastName
        })
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`);

      res.status.should.be.equal(200);
      res.body.meta.count.should.be.greaterThan(0);
      res.body.users.length.should.be.greaterThan(0);
      res.body.users[0].profile.firstName.should.be.equal(newUser.profile.firstName);
      res.body.users[0].profile.firstName.should.be.equal(newUser.profile.firstName);
      res.body.users[0].uid.should.be.equal(newUser.uid);
      res.body.users[0].email.should.be.equal(newUser.email);
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    function requestUserUpdate(currentUser: IUser, updatedUser: IUser) {
      return chai.request(app)
        .put(`${BASE_URL}/${updatedUser._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(currentUser)}`)
        .send(updatedUser);
    }

    function requestUserUpdateAndCatch(currentUser: IUser, updatedUser: IUser) {
      return requestUserUpdate(currentUser, updatedUser).catch(err => err.response);
    }

    function assertFailure(res: request.Response, status: number, name: string, message: string) {
      res.status.should.be.equal(status);
      res.body.name.should.be.equal(name);
      res.body.message.should.be.equal(message);
    }

    it('should fail with bad request (revoke own admin privileges)', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const updatedUser = admin;
      updatedUser.role = 'teacher';

      const res = await requestUserUpdateAndCatch(admin, updatedUser);
      assertFailure(res, 400, 'BadRequestError', errorCodes.user.cantChangeOwnRole.text);
    });

    it('should fail with bad request (email already in use)', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const updatedUser = await FixtureUtils.getRandomStudent();
      updatedUser.email = admin.email;

      const res = await requestUserUpdateAndCatch(admin, updatedUser);
      assertFailure(res, 400, 'BadRequestError', errorCodes.user.emailAlreadyInUse.text);
    });

    // This test is disabled because there currently is no role beneath 'admin' that is allowed to edit other users.
    // Reactivate and adjust this test if such a role should become available in the future.
    // (Previously teachers had permission to change some parts of any student's profile.)
    /*
    it('should fail changing other user\'s uid with wrong authorization (not admin)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const updatedUser = await FixtureUtils.getRandomStudent();
      updatedUser.uid = '987456';

      const res = await requestUserUpdateAndCatch(teacher, updatedUser);
      assertFailure(res, 403, 'ForbiddenError', errorCodes.user.onlyAdminsCanChangeUids.text);
    });
    */

    it('should fail changing other user\'s name with wrong authorization (low edit level)', async () => {
      const [student, updatedUser] = await FixtureUtils.getRandomStudents(2, 2);
      updatedUser.profile.firstName = 'TEST';

      const res = await requestUserUpdateAndCatch(student, updatedUser);
      assertFailure(res, 403, 'ForbiddenError', errorCodes.user.cantChangeUserWithHigherRole.text);
    });

    it('should update user base data without password', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const updatedUser = student;
      updatedUser.password = undefined;
      updatedUser.profile.firstName = 'Updated';
      updatedUser.profile.lastName = 'User';
      updatedUser.email = 'student2@updated.local';

      const res = await requestUserUpdate(student, updatedUser);
      res.status.should.be.equal(200);
      res.body.profile.firstName.should.be.equal('Updated');
      res.body.profile.lastName.should.be.equal('User');
      res.body.email.should.be.equal('student2@updated.local');
    });

    it('should update user data', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const updatedUser = student;
      updatedUser.password = '';
      updatedUser.profile.firstName = 'Updated';
      updatedUser.profile.lastName = 'User';
      updatedUser.email = 'student1@updated.local';

      const res = await requestUserUpdate(student, updatedUser);
      res.status.should.be.equal(200);
      res.body.profile.firstName.should.be.equal('Updated');
      res.body.profile.lastName.should.be.equal('User');
      res.body.email.should.be.equal('student1@updated.local');
    });

    it('should update user base data without password', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const updatedUser = student;
      updatedUser.password = undefined;
      updatedUser.profile.firstName = 'Updated';
      updatedUser.profile.lastName = 'User';
      updatedUser.email = 'student@updated.local';

      const res = await requestUserUpdate(student, updatedUser);
      res.status.should.be.equal(200);
      res.body.profile.firstName.should.be.equal('Updated');
      res.body.profile.lastName.should.be.equal('User');
      res.body.email.should.be.equal('student@updated.local');
    });

    it('should keep a existing uid', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const student = await FixtureUtils.getRandomStudent();
      const origUid = student.uid;
      const updatedUser = student;
      updatedUser.uid = null;
      updatedUser.password = '';
      updatedUser.profile.firstName = 'Updated';
      updatedUser.profile.lastName = 'User';
      updatedUser.email = 'student@updated.local';

      const res = await requestUserUpdate(admin, updatedUser);
      res.status.should.be.equal(200);
      res.body.uid.should.be.equal(origUid);
      res.body.profile.firstName.should.be.equal('Updated');
      res.body.profile.lastName.should.be.equal('User');
      res.body.email.should.be.equal('student@updated.local');
    });
  });

  describe(`POST ${BASE_URL}/picture`, () => {
    async function requestAddUserPicture(currentUser: IUser, targetUser: IUser) {
      return await chai.request(app)
        .post(`${BASE_URL}/picture/${targetUser._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(currentUser)}`)
        .attach('file', fs.readFileSync('test/resources/test.png'), 'test.png');
    }

    function assertSuccess(res: request.Response) {
      res.status.should.be.equal(200);
      res.body.profile.picture.should.be.an('object');
      res.body.profile.picture.should.have.all.keys('alias', 'name', 'path');
      res.body.profile.picture.alias.should.be.equal('test.png');
    }

    it('should upload a new user picture', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const res = await requestAddUserPicture(admin, admin);
      assertSuccess(res);
    });

    it('should fail to upload a new picture for another user (as student)', async () => {
      const [student, targetUser] = await FixtureUtils.getRandomStudents(2, 2);
      const res = await requestAddUserPicture(student, targetUser);
      res.status.should.be.equal(403);
      res.body.name.should.be.equal('ForbiddenError');
      res.body.message.should.be.equal(errorCodes.user.cantChangeUserWithHigherRole.text);
    });

    it('should upload a new picture for another user (as admin)', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const targetUser = await FixtureUtils.getRandomStudent();
      const res = await requestAddUserPicture(admin, targetUser);
      assertSuccess(res);
    });

    it('should block non images when uploading new user picture', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .post(`${BASE_URL}/picture/${admin._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
        .attach('file', fs.readFileSync('test/resources/wrong-format.rtf'), 'wrong-format.txt');

      res.status.should.be.equal(403);
      res.body.name.should.be.equal('ForbiddenError');
    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    async function ensureOnlyOneAdmin() {
      const admins = await FixtureUtils.getRandomAdmins(1, 2);
      admins.length.should.be.eq(1);
      return admins[0];
    }

    it('should fail to delete the only admin', async () => {
      const admin = await ensureOnlyOneAdmin();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${admin._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.user.noOtherAdmins.text);
    });

    it('should fail to delete another user, if not admin', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const studtent = await FixtureUtils.getRandomStudent();
      const res = await chai.request(app)
        .del(`${BASE_URL}/${studtent._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.user.cantDeleteOtherUsers.text);
    });

    it('should (promote a teacher to admin and) let the old admin delete itself', async () => {
      const admin = await ensureOnlyOneAdmin();
      const promotedUser = await FixtureUtils.getRandomTeacher();
      { // Promote the teacher to admin
        promotedUser.role = 'admin';

        const res = await chai.request(app)
          .put(`${BASE_URL}/${promotedUser._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
          .send(promotedUser);

        res.status.should.be.equal(200);
        res.body.role.should.be.equal('admin');
      }
      { // Delete the old admin
        const res = await chai.request(app)
          .del(`${BASE_URL}/${admin._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(admin)}`);

        res.status.should.be.equal(200);
      }
    });

    it('should send delete request', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${teacher._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .catch(err => err.response);

      const userDeleteRequest = User.findById(teacher._id);

      should.exist(userDeleteRequest, 'User doesnt exist anymore.');

      res.status.should.be.equal(200);
    });

    it('should delete a student', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const student = await FixtureUtils.getRandomStudent();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`);

      res.status.should.be.equal(200);
      res.body.result.should.be.equal(true);
    });
  });
});
