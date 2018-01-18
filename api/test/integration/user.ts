import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {IUser} from '../../../shared/models/IUser';
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
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);

      res.status.should.be.equal(200);
      res.body.should.be.a('array');
      res.body.length.should.be.equal(40);
    });

    it('should fail with wrong authorization', async () => {

      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);

      res.status.should.be.equal(401);
    });

    it('should return the a user object', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .get(`${BASE_URL}/${admin._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`);

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
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .catch(err => err.response);

      res.status.should.be.equal(403);
    });

    it('should return an array with the defined roles', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .get(ROLE_URL)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`);

      res.status.should.be.equal(200);
      res.body.should.be.a('array');
      res.body.length.should.be.equal(4);
      res.body.should.have.same.members(['student', 'tutor', 'teacher', 'admin']);
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
          ' ' + newUser.profile.lastName
        })
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);

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
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);

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
    it('should fail with bad request (revoke own admin privileges)', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const updatedUser = admin;
      updatedUser.role = 'teacher';
      const res = await chai.request(app)
        .put(`${BASE_URL}/${admin._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .send(updatedUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('You can\'t revoke your own privileges');
    });

    it('should fail with wrong authorization (uid)', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const updatedUser = user;
          updatedUser.uid = '987456';
          chai.request(app)
            .put(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(updatedUser)
            .end((err, res) => {
              res.status.should.be.equal(403);
              res.body.name.should.be.equal('ForbiddenError');
              res.body.message.should.be.equal('Only users with admin privileges can change uids');
              done();
            });
        })
        .catch(done);
    });

    it('should fail with bad request (email already in use)', async () => {
      const users = await FixtureUtils.getRandomUsers(2, 2);
      const updatedUser = users[0];
      updatedUser.email = users[1].email;

      const res = await chai.request(app)
        .put(`${BASE_URL}/${users[0]._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(users[0])}`)
        .send(updatedUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('This mail address is already in use.');
    });

    it('should fail with wrong authorization (role edit)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const updatedUser = teacher;
      updatedUser.role = 'admin';

      const res = await chai.request(app)
        .put(`${BASE_URL}/${teacher._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(updatedUser)
        .catch(err => err.response);

      res.status.should.be.equal(403);
      res.body.name.should.be.equal('ForbiddenError');
      res.body.message.should.be.equal('Only users with admin privileges can change roles');
    });

    it('should fail with wrong authorization (uid)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const updatedUser = teacher;
      updatedUser.uid = '987456';

      const res = await chai.request(app)
        .put(`${BASE_URL}/${teacher._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(updatedUser)
        .catch(err => err.response);

      res.status.should.be.equal(403);
      res.body.name.should.be.equal('ForbiddenError');
      res.body.message.should.be.equal('Only users with admin privileges can change uids');
    });

    it('should update user base data without password', async () => {
      const student = await FixtureUtils.getRandomStudent();
          const updatedUser = student;
          updatedUser.password = undefined;
          updatedUser.profile.firstName = 'Updated';
          updatedUser.profile.lastName = 'User';
          updatedUser.email = 'student2@updated.local';
          const res = await chai.request(app)
            .put(`${BASE_URL}/${student._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
            .send(updatedUser);
              res.status.should.be.equal(200);
              res.body.profile.firstName.should.be.equal('Updated');
              res.body.profile.lastName.should.be.equal('User');
              res.body.email.should.be.equal('student2@updated.local');
    });

    it('should fail with missing password', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const updatedUser = student;
      updatedUser.password = '1234test';

      const res = await chai.request(app)
        .put(`${BASE_URL}/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .send(updatedUser)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('You must specify your current password if you want to set a new password.');
    });

    it('should update user data', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const updatedUser = student;
      updatedUser.password = '';
      updatedUser.profile.firstName = 'Updated';
      updatedUser.profile.lastName = 'User';
      updatedUser.email = 'student1@updated.local';

      const res = await chai.request(app)
        .put(`${BASE_URL}/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .send(updatedUser);

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

      const res = await chai.request(app)
        .put(`${BASE_URL}/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .send(updatedUser);

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

      const res = await chai.request(app)
        .put(`${BASE_URL}/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .send(updatedUser);

      res.status.should.be.equal(200);
      res.body.uid.should.be.equal(origUid);
      res.body.profile.firstName.should.be.equal('Updated');
      res.body.profile.lastName.should.be.equal('User');
      res.body.email.should.be.equal('student@updated.local');
    });
  });

  describe(`POST ${BASE_URL}/picture`, () => {
    it('should upload a new user picture', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .post(`${BASE_URL}/picture/${admin._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .attach('file', fs.readFileSync('test/resources/test.png'), 'test.png');

      res.status.should.be.equal(200);
      res.body.profile.picture.name.should.match(new RegExp(`${admin._id}-[0-9]{4}.png`));
    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    it('should fail to delete the only admin', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${admin._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .catch(err => err.response);

      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('There are no other users with admin privileges.');
    });

    it('should fail to delete (wrong role)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${teacher._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .catch(err => err.response);

      res.status.should.be.equal(403);
    });

    it('should delete a student', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const student = await FixtureUtils.getRandomStudent();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`);

      res.status.should.be.equal(200);
      res.body.result.should.be.equal(true);
    });
  });
});
