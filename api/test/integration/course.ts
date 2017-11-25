import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/courses';
const fixtureLoader = new FixtureLoader();

describe('Course', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`GET ${BASE_URL}`, () => {
    it('should return all active courses', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user) => {
          chai.request(app)
            .get(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(5);

              res.body.forEach((course: any) => {
                course._id.should.be.a('string');
                course.name.should.be.a('string');
                course.active.should.be.a('boolean');
                course.active.should.be.equal(true);
              });

              done();
            });
        })
        .catch(done);
    });


    it('should return all courses', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          chai.request(app)
            .get(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(6);

              res.body.forEach((course: any) => {
                course._id.should.be.a('string');
                course.name.should.be.a('string');
                course.active.should.be.a('boolean');
                course.active.should.be.oneOf([true, false]);
              });

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

  describe(`POST ${BASE_URL}`, () => {
    it('should add a new course', (done) => {

      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const testData = {
            name: 'Test Course',
            description: 'Test description'
          };

          chai.request(app)
            .post(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(testData)
            .end((err, res) => {
              res.status.should.be.equal(200);

              res.body.name.should.equal(testData.name);
              res.body.description.should.equal(testData.description);

              done();
            });
        })
        .catch(done);
    });
  });


  describe(`GET ${BASE_URL} :id`, () => {
    it('should get course with given id', (done) => {
      User.findOne({email: 'teacher1@test.local'}).then((user) => {
        const testData = new Course({
          name: 'Test Course',
          description: 'Test description',
          active: true
        });
        testData.teachers.push(user);
        testData.save((error, course) => {
          chai.request(app)
            .get(`${BASE_URL}/${course._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.name.should.be.equal(testData.name);
              res.body.description.should.be.equal(testData.description);
              res.body.active.should.be.equal(testData.active);
              done();
            });
        });
      }).catch(done);
    });

    it('should not get course not a teacher of course', (done) => {
      User.findOne({email: 'teacher1@test.local'}).then((user) => {
        const testData = new Course({
          name: 'Test Course',
          description: 'Test description',
          active: true
        });
        testData.save((error, course) => {
          chai.request(app)
            .get(`${BASE_URL}/${course._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
        });
      }).catch(done);
    });
  });

  describe(`PUT ${BASE_URL} :id`, () => {
    it('change added course', (done) => {
      User.findOne({email: 'teacher1@test.local'}).then((user) => {
        const testDataUpdate = new Course({
          name: 'Test Course Update',
          description: 'Test description update',
          active: true
        });
        const testData = new Course(
          {
            name: 'Test Course',
            description: 'Test description',
            active: false
          });
        testData.teachers.push(user);
        testData.save((error, course) => {
          testDataUpdate._id = course._id;
          chai.request(app)
            .put(`${BASE_URL}/${testDataUpdate._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(testDataUpdate)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.name.should.be.eq(testDataUpdate.name);
              res.body.description.should.be.eq(testDataUpdate.description);
              res.body.active.should.be.eq(testDataUpdate.active);
              done();
            });
        }).catch(done);
      });
    });

    it('should not change course not a teacher of course', (done) => {
      User.findOne({email: 'teacher1@test.local'}).then((user) => {
        const testData = new Course(
          {
            name: 'Test Course',
            description: 'Test description',
            active: false
          });
        testData.save((error, course) => {
          chai.request(app)
            .put(`${BASE_URL}/${course._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(course)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
        });
      }).catch(done);
    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    it('should delete the Course', (done) => {
    User.findOne({email: 'teacher1@test.local'}).then((user) => {
      const testData = new Course(
        {
          name: 'Test Course',
          description: 'Test description',
          courseAdmin: user._id,
          active: true
        });
      testData.save((error, course) => {
        chai.request(app)
          .del(`${BASE_URL}/${course._id}`)
          .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
          .end((err, res) => {
           console.log('End Test');
            res.status.should.be.equal(200);
            // res.body.result.should.be.equal(true);
            done();
          });
      }).catch(done);
    });
  });

    it('should not delete the Course and 403 because no rights', (done) => {
      User.findOne({email: 'student26@test.local'}).then((user) => {
        const testData = new Course(
          {
            name: 'Test Course',
            description: 'Test description',
            courseAdmin: user._id,
            active: true
          });
        testData.save((error, course) => {
          chai.request(app)
            .del(`${BASE_URL}/${course._id}`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              console.log('End Test');
              res.status.should.be.equal(403);
              // res.body.result.should.be.equal(true);
              done();
            });
        }).catch(done);
      });
    });

});

});


