process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Unit} from '../../src/models/units/Unit';
import {Lecture} from '../../src/models/Lecture';
import {Course} from '../../src/models/Course';
import {CodeKataUnit} from '../../src/models/units/CodeKataUnit';
import * as moment from 'moment';

chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/progress';
const fixtureLoader = new FixtureLoader();

describe('ProgressController', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`POST ${BASE_URL}`, () => {
    it('should create progress for some progressable unit', async () => {
      const unit = await Unit.findOne({progressable: true});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        done: true,
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
          .send(newProgress)
          .end((err, res) => {
            if (err) {
              return reject(err);
            }
            res.status.should.be.equal(200);
            res.body.course.should.be.equal(newProgress.course);
            res.body.unit.should.be.equal(newProgress.unit);
            res.body.user.should.be.equal(newProgress.user);
            res.body.done.should.be.equal(newProgress.done);
            res.body._id.should.be.a('string');

            resolve();
          });
      });
    });

    it('should create progress for some progressable unit with a deadline', async () => {
      const unit: any = await Unit.findOne({progressable: true});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      unit.deadline = moment().add(1, 'hour').format();
      await unit.save();

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        done: true,
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
          .send(newProgress)
          .end((err, res) => {
            if (err) {
              return reject(err);
            }
            res.status.should.be.equal(200);
            res.body.course.should.be.equal(newProgress.course);
            res.body.unit.should.be.equal(newProgress.unit);
            res.body.user.should.be.equal(newProgress.user);
            res.body.done.should.be.equal(newProgress.done);
            res.body._id.should.be.a('string');

            resolve();
          });
      });
    });

    it('should fail creating progress for some progressable unit with a deadline', async () => {
      const unit: any = await Unit.findOne({progressable: true});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      unit.deadline = moment().subtract(1, 'hour').format();
      await unit.save();

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        done: true,
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
          .send(newProgress)
          .end((err, res) => {
            res.status.should.be.equal(400);
            err.message.should.be.equal('Bad Request');
            res.body.message.should.be.equal('Past deadline, no further update possible');

            resolve();
          });
      });
    });
  });
});
