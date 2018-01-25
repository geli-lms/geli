import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, API_NOTIFICATION_TYPE_NONE, NotificationSettings} from '../../src/models/NotificationSettings';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
import chaiHttp = require('chai-http');

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

  describe(`GET ${BASE_URL} user :id`, () => {
    it('should return all notification settings for a student', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course1 = await FixtureUtils.getRandomCourse();
      const course2 = await FixtureUtils.getRandomCourse();
      course1.students.push(student);
      course2.students.push(student);
      await Course.update(course1, {new: true});
      await Course.update(course2, {new: true});

      await new NotificationSettings({
        'user': student, 'course': course1,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      await new NotificationSettings({
        'user': student, 'course': course2,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();


      const res = await chai.request(app)
        .get(`${BASE_URL}/user/${student._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`);
      res.should.have.status(200);
      res.body.forEach((notificationSettings: any) => {
        notificationSettings._id.should.be.a('string');
        notificationSettings.user.toString().should.be.a('string');
        notificationSettings.course.toString().should.be.a('string');
        notificationSettings.notificationType.should.be.a('string');
        notificationSettings.emailNotification.should.be.a('boolean');
      });
    })
  });

  describe(`PUT ${BASE_URL} :id`, () => {
    it('should update the notification settings', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse();
      course.students.push(student);
      await Course.update(course, {new: true});
      const settings = await new NotificationSettings({
        'user': student, 'course': course,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      settings.notificationType = API_NOTIFICATION_TYPE_NONE;
      settings.emailNotification = true;

      const res = await chai.request(app)
        .put(`${BASE_URL}/${settings._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .send(settings);
      res.should.have.status(200);
      res.body.notificationType.should.be.equal(API_NOTIFICATION_TYPE_NONE);
      res.body.emailNotification.should.be.equal(true);
      res.body.should.have.property('user');
      res.body.should.have.property('course');
      res.body._id.should.be.a('string');
    })
  })
});

