process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {StudentConfig} from '../../src/models/StudentConfig';
import {Course} from '../../src/models/Course';
import {FixtureLoader} from '../../fixtures/FixtureLoader';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/studentConfig';
const fixtureLoader = new FixtureLoader();

describe('StudentConfigController', () => {

  beforeEach(() => fixtureLoader.load());

  describe(`Get ${BASE_URL}`, () => {
    it('should get the saved config', (done) => {
      Course.findOne({students: {$exists: true, $not: {$size: 0}}}).then((course) => {
        User.findOne({_id: course.students[0]._id}).then((student) => {
          const courseList: any[] = [];
          courseList.push(course._id);
          const studentCon = {user: student._id, lastVisitedCourses: courseList};
          new StudentConfig(studentCon).save().then((config) => {
            chai.request(app)
              .get(BASE_URL + '/' + student._id)
              .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
              .end((err, res) => {
                res.status.should.be.equal(200);
                done();
              });
          }).catch(done);
        });
      });
    });

    it('should fail', (done) => {
      User.findOne({role: 'student'}).then((student) => {
        chai.request(app)
          .get(BASE_URL + '/' + student._id)
          .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
          .end((err, res) => {
            res.status.should.be.equal(404);
            done();
          });
      }).catch(done);
    });
  });


  describe(`POST ${BASE_URL}`, () => {
    it('should POST a new Studentconfig', (done) => {
      Course.findOne().then((course) => {
        User.findOne({_id: course.students[0]._id}).then((student) => {
          const courseList: any[] = [];
          courseList.push(course._id);
          const studentCon = {user: student._id, lastVisitedCourses: courseList};
          chai.request(app)
            .post(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
            .send(studentCon)
            .end((err, res) => {
              res.status.should.be.equal(200);
              done();
            });
        }).catch(done);
      });
    });

    it('should fail because item is already there', (done) => {
      Course.findOne().then((course) => {
        User.findOne({_id: course.students[0]._id}).then((student) => {
          const courseList: any[] = [];
          courseList.push(course._id);
          const studentCon = {user: student._id, lastVisitedCourses: courseList};
          new StudentConfig(studentCon).save().then((config) => {
            chai.request(app)
              .post(BASE_URL)
              .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
              .send(studentCon)
              .end((err, res) => {
                res.status.should.be.equal(400);
                done();
              });
          }).catch(done);
        });
      });
    });
    it('should fail because item has wrong id', (done) => {
      Course.findOne().then((course) => {
        User.findOne({_id: course.students[0]._id}).then((student) => {
          const courseList: any[] = [];
          courseList.push(course._id);
          const studentCon = {user: '000000000000000000000000', lastVisitedCourses: courseList};
          new StudentConfig(studentCon).save().then((config) => {
            chai.request(app)
              .post(BASE_URL)
              .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
              .send(studentCon)
              .end((err, res) => {
                res.status.should.be.equal(400);
                done();
              });
          }).catch(done);
        });
      });
    });
  });

  describe(`PUT ${BASE_URL} :id`, () => {
    it('Should add a Config and change it', (done) => {
      Course.findOne().then((course) => {
        User.findOne({_id: course.students[0]._id}).then((student) => {
          const testConfig = new StudentConfig({
            user: student._id,
            lastVisitedCourse: [course._id]
          });

          testConfig.save((error, config) => {
            config.lastVisitedCourses = course._id;
            chai.request(app)
              .put(`${BASE_URL}/${config._id}`)
              .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
              .send(config)
              .end((err, res) => {
                res.should.have.status(200);
                done();
              });
          }).catch(done);
        });
      });
    });

    it('Should fail because student id ist wrong', (done) => {
      Course.findOne().then((course) => {
        User.findOne({_id: course.students[0]._id}).then((student) => {
          const testConfig = new StudentConfig({
            user: '000000000000000000000000',
            lastVisitedCourse: [course._id]
          });

          testConfig.save((error, config) => {
            config.lastVisitedCourses = course._id;
            chai.request(app)
              .put(`${BASE_URL}/${student._id}`)
              .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
              .send(config)
              .end((err, res) => {
                res.should.have.status(400);
                done();
              });
          }).catch(done);
        });
      });
    });
  });
});
