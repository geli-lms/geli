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

  describe(`GET ${BASE_URL}`, () => {
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


      const res = await testHelper.commonUserGetRequest(student, '');
      res.should.have.status(200);
      res.body.forEach((notificationSettings: any) => {
        notificationSettings.course.should.be.a('string');
        notificationSettings.notificationType.should.be.a('string');
        notificationSettings.emailNotification.should.be.a('boolean');
      });
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it('should create notification settings', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      course.students.push(student);
      await course.save();

      const res = await testHelper.commonUserPutRequest(student, '', {
        course: course.id,
        notificationType: API_NOTIFICATION_TYPE_ALL_CHANGES,
        emailNotification: false
      });
      res.status.should.be.equals(200);
    });

    it('should update notification settings', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      course.students.push(student);
      await course.save();

      await new NotificationSettings({
        'user': student, 'course': course,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      const res = await testHelper.commonUserPutRequest(student, '', {
        course: course.id,
        notificationType: API_NOTIFICATION_TYPE_NONE,
        emailNotification: true
      });
      res.should.have.status(200);
    });

    it('should fail with missing parameters', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[Math.floor(Math.random() * course.students.length)];

      await new NotificationSettings({
        'course': course,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES,
        'emailNotification': false
      }).save();

      const res = await testHelper.commonUserPutRequest(student, '', {});
      res.should.have.status(400);
    });

    it('should be forbidden for an unauthorized user/course pair', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const res = await testHelper.commonUserPutRequest(teacher, '', {
        course: course.id,
        notificationType: API_NOTIFICATION_TYPE_NONE,
        emailNotification: true
      });
      res.should.have.status(403);
    });

    it('should fail for a non-existent course id', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const res = await testHelper.commonUserPutRequest(student, '', {
        course: '000000000000000000000000',
        notificationType: API_NOTIFICATION_TYPE_NONE,
        emailNotification: true
      });
      res.should.have.status(404);
    });
  });
});

