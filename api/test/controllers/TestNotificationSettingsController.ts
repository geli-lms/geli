import * as chai from 'chai';
import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {
  API_NOTIFICATION_TYPE_ALL_CHANGES,
  API_NOTIFICATION_TYPE_NONE,
  NotificationSettings
} from '../../src/models/NotificationSettings';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const BASE_URL = '/api/notificationSettings';
const testHelper = new TestHelper(BASE_URL);

describe('NotificationSettings', async () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should create notification settings', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[0];
      const newSettings = {user: student, course: course};

      const res = await testHelper.commonUserPostRequest(student, '', newSettings);

      res.status.should.be.equals(200);
      res.body.notificationType.should.be.equal(API_NOTIFICATION_TYPE_ALL_CHANGES);
      res.body.emailNotification.should.be.equal(false);
      res.body.should.have.property('course');
      res.body._id.should.be.a('string');
      const notificationSettings = (await NotificationSettings.findById(res.body._id)).forView();
      notificationSettings.course.should.be.equal(res.body.course);
    });

    it('should fail when already exist', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[0];
      const newSettings = {user: student, course: course};

      const res = await testHelper.commonUserPostRequest(student, '', newSettings);
      res.status.should.be.equals(200);

      const resFail = await testHelper.commonUserPostRequest(student, '', newSettings);
      resFail.status.should.be.equals(400);
    });

    it('should fail when course or user missing', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[0];

      const res = await testHelper.commonUserPostRequest(student, '', {});
      res.status.should.be.equals(400);
    });
  });

  describe(`GET ${BASE_URL} user :id`, () => {
    it('should return all notification settings for a student', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course1 = await FixtureUtils.getRandomCourse();
      const course2 = await FixtureUtils.getRandomCourse();
      course1.students.push(student);
      course2.students.push(student);
      await course1.save();
      await course2.save();

      await new NotificationSettings({
        'user': student, 'course': course1,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      await new NotificationSettings({
        'user': student, 'course': course2,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();


      const res = await testHelper.commonUserGetRequest(student, '/');
      res.should.have.status(200);
      res.body.forEach((notificationSettings: any) => {
        notificationSettings._id.should.be.a('string');
        notificationSettings.course.should.be.a('string');
        notificationSettings.notificationType.should.be.a('string');
        notificationSettings.emailNotification.should.be.a('boolean');
      });
    });
  });

  describe(`PUT ${BASE_URL} :id`, () => {
    it('should update the notification settings', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse();

      course.students.push(student);
      await course.save();

      const settings = await new NotificationSettings({
        'user': student, 'course': course,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      settings.notificationType = API_NOTIFICATION_TYPE_NONE;
      settings.emailNotification = true;

      const res = await testHelper.commonUserPutRequest(student, `/${settings._id}`, settings);
      res.should.have.status(200);
      res.body.notificationType.should.be.equal(API_NOTIFICATION_TYPE_NONE);
      res.body.emailNotification.should.be.equal(true);
      res.body.should.have.property('course');
      res.body._id.should.be.a('string');
    });

    it('should fail when missing course or user', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[Math.floor(Math.random() * course.students.length)];

      const settings = await new NotificationSettings({
        'course': course,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES,
        'emailNotification': false
      }).save();

      const res = await testHelper.commonUserPutRequest(student, `/${settings._id}`, []);
      res.should.have.status(400);
    });
  });
});

