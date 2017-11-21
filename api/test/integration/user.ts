import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {IUser} from '../../../shared/models/IUser';
import fs = require('fs');

chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/users';
const ROLE_URL = BASE_URL + '/roles';
const fixtureLoader = new FixtureLoader();

describe('User', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`GET ${BASE_URL}`, () => {
    it('should return all users', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          chai.request(app)
            .get(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.equal(40);

              done();
            });
        })
        .catch(done);
    });

    it('should fail with wrong authorization', (done) => {
      chai.request(app)
        .get(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .end((err, res) => {
          res.status.should.be.equal(401);
          done();
        });
    });
  });

  describe(`GET ${BASE_URL}`, () => {
    it('should return the user admin@test.local', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user: IUser) => {
          chai.request(app)
            .get(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              done();
            });
        })
        .catch(done);
    });
  });

  describe(`GET ${ROLE_URL}`, () => {
    it('should fail with wrong authorization', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user) => {
          chai.request(app)
            .get(ROLE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(403);
              done();
            });
        })
        .catch(done);
    });

    it('should return an array with the defined roles', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user) => {
          chai.request(app)
            .get(ROLE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.equal(4);
              res.body.should.have.same.members(['student', 'tutor', 'teacher', 'admin']);
              done();
            });
        })
        .catch(done);
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it('should fail with bad request (admin privileges)', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user) => {
          const updatedUser = user;
          updatedUser.role = 'teacher';
          chai.request(app)
            .put(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(updatedUser)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('There are no other users with admin privileges.');
              done();
            });
        })
        .catch(done);
    });

    it('should fail with bad request (email)', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user) => {
          const updatedUser = user;
          updatedUser.email = 'teacher1@test.local';
          chai.request(app)
            .put(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(updatedUser)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('This mail address is already in use.');
              done();
            });
        })
        .catch(done);
    });

    it('should fail with wrong authorization (role edit)', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const updatedUser = user;
          updatedUser.role = 'admin';
          chai.request(app)
            .put(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(updatedUser)
            .end((err, res) => {
              res.status.should.be.equal(403);
              res.body.name.should.be.equal('ForbiddenError');
              res.body.message.should.be.equal('Only users with admin privileges can change roles');
              done();
            });
        })
        .catch(done);
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

    it('should fail with missing password', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user: IUser) => {
          const updatedUser = user;
          updatedUser.password = '1234';
          chai.request(app)
            .put(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(updatedUser)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('You must specify your current password if you want to set a new password.');

              done();
            });
        })
        .catch(done);
    });

    it('should update user data', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user: IUser) => {
          const updatedUser = user;
          updatedUser.password = '';
          updatedUser.profile.firstName = 'Updated';
          updatedUser.profile.lastName = 'User';
          updatedUser.email = 'student1@updated.local';
          chai.request(app)
            .put(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(updatedUser)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.profile.firstName.should.be.equal('Updated');
              res.body.profile.lastName.should.be.equal('User');
              res.body.email.should.be.equal('student1@updated.local');
              done();
            });
        })
        .catch(done);
    });

    it('should update user base data without password', (done) => {
      User.findOne({email: 'student2@test.local'})
      .then((user: IUser) => {
        const updatedUser = user;
        updatedUser.password = undefined;
        updatedUser.profile.firstName = 'Updated';
        updatedUser.profile.lastName = 'User';
        updatedUser.email = 'student2@updated.local';
        chai.request(app)
        .put(`${BASE_URL}/${user._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
        .send(updatedUser)
        .end((err, res) => {
          res.status.should.be.equal(200);
          res.body.profile.firstName.should.be.equal('Updated');
          res.body.profile.lastName.should.be.equal('User');
          res.body.email.should.be.equal('student2@updated.local');
          done();
        });
      })
      .catch(done);
    });

    it('should keep a existing uid', (done) => {
      User.findOne({email: 'admin@test.local'})
      .then((user: IUser) => {
        return User.findOne({email: 'student1@test.local'}).then(student => ({user, student}));
      })
        .then(({user, student}) => {
        const updatedUser = student;
        updatedUser.uid = null;
        updatedUser.password = '';
        updatedUser.profile.firstName = 'Updated';
        updatedUser.profile.lastName = 'User';
        updatedUser.email = 'student3@updated.local';
        chai.request(app)
        .put(`${BASE_URL}/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
        .send(updatedUser)
        .end((err, res) => {
          res.status.should.be.equal(200);
          res.body.profile.firstName.should.be.equal('Updated');
          res.body.profile.lastName.should.be.equal('User');
          res.body.email.should.be.equal('student3@updated.local');
          done();
        });
      })
      .catch(done);
    });
  });

  describe(`POST ${BASE_URL}/picture`, () => {
    it('should upload a new user picture', (done) => {
      User.findOne({email: 'admin@test.local'})
      .then((user: IUser) => {
        chai.request(app)
          .post(`${BASE_URL}/picture/${user._id}`)
          .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
          .attach('file', fs.readFileSync('test/resources/test.png'), 'test.png')
          .end((err, res) => {
            res.status.should.be.equal(200);
            res.body.profile.picture.name.should.match(new RegExp(`${user._id}-[0-9]{4}.png`));

            done();
          });
      })
      .catch(done);
    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    it('should fail to delete the only admin', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user: IUser) => {
          chai.request(app)
            .del(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(400);
              res.body.name.should.be.equal('BadRequestError');
              res.body.message.should.be.equal('There are no other users with admin privileges.');
              done();
            });
        })
        .catch(done);
    });

    it('should fail to delete (wrong role)', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user: IUser) => {
          chai.request(app)
            .del(`${BASE_URL}/${user._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(403);
              done();
            });
        })
        .catch(done);
    });

    it('should delete student1@test.local', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user: IUser) => {
          return User.findOne({email: 'student1@test.local'}).then(student => ({user, student}));
        })
        .then(({user, student}) => {
          chai.request(app)
            .del(`${BASE_URL}/${student._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.result.should.be.equal(true);

              done();
            });
        })
        .catch(done);
    });
  });
});
