import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, NotificationSettings} from '../../src/models/NotificationSettings';
import {User} from '../../src/models/User';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/notificationSettings';
const fixtureLoader = new FixtureLoader()

describe('NotificationSettings', async () => {
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should create notification settings', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = await User.findById(course.students[0]);
      const newSettings = {user: student, course: course};

      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .send(newSettings);

      res.status.should.be.equals(200);
      res.body.notificationType.should.be.equal(API_NOTIFICATION_TYPE_ALL_CHANGES);
      res.body.emailNotification.should.be.equal(false);
      res.body.should.have.property('user');
      res.body.should.have.property('course');
      res.body._id.should.be.a('string');
      const notificationSettings = await NotificationSettings.findById(res.body._id);
      notificationSettings.user.toString().should.be.equal(newSettings.user._id.toString());
      notificationSettings.course.toString().should.be.equal(newSettings.course._id.toString());
    })
  });
});
