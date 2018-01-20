import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Notification} from '../../src/models/Notification';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/notification';
const fixtureLoader = new FixtureLoader()

describe('Notifications', async () => {
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should fail if course or text are not given', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        changedCourse: course,
      };

      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(newNotification)
        .catch(err => err.response);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Notification needs at least the fields course and text');
    });

    it('should create notifications for students with the corresponding settings', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        changedCourse: course,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(course.students.length);
    });
  })
});
