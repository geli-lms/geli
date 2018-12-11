import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {Notification} from '../../src/models/Notification';
import {User} from '../../src/models/User';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, API_NOTIFICATION_TYPE_NONE, NotificationSettings} from '../../src/models/NotificationSettings';

chai.use(chaiHttp);
const should = chai.should();
const BASE_URL = '/api/notification';
const testHelper = new TestHelper(BASE_URL);

describe('Notifications', async () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should fail if course or text are not given', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        targetId: course.id,
        targetType: 'course'
      };

      const res = await testHelper.commonUserPostRequest(teacher, '', newNotification);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('ParamRequiredError');
    });

    it('should create notifications for students with the corresponding settings', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, '', newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(course.students.length);
    });

    it('should forbid notification creation for an unauthorized teacher', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(unauthorizedTeacher, '', newNotification);
      res.status.should.be.equal(403);
    });
  });

  describe(`POST ${BASE_URL} user :id`, async () => {
    it('should fail if course and text are not given', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const res = await testHelper.commonUserPostRequest(teacher, '/user/507f191e810c19729de860ea', {});
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('ParamRequiredError');
    });

    it('should fail if user not given', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, '/user/507f191e810c19729de860ea', newNotification);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Could not create notification because user not found');
    });

    it('should create notifications for student with changedCourse and text', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with changedCourse and text', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      await new NotificationSettings({
        user: student,
        course: course,
        notificationType: API_NOTIFICATION_TYPE_ALL_CHANGES,
        emailNotification: true
      }).save();

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with changedCourse, changedLecture, changedUnit and text', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const lecture = await FixtureUtils.getRandomLectureFromCourse(course);
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);
      const unit = await FixtureUtils.getRandomUnitFromLecture(lecture);
      unit.visible = true;
      await unit.save();

      const newNotification = {
        targetId: unit.id,
        targetType: 'unit',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with changedCourse and text but API_NOTIFICATION_TYPE_NONE', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      await new NotificationSettings({
        user: student,
        course: course,
        notificationType: API_NOTIFICATION_TYPE_NONE,
        emailNotification: false
      }).save();

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with text only', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        targetType: 'text',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({user: student._id});
      notifications.length.should.be.equal(1);
    });

    it('should forbid notification creation for an unauthorized teacher', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      await course.save();
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(unauthorizedTeacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(403);
    });
  });

  describe(`GET ${BASE_URL} user :id`, () => {
    it('should return all notifications for one user', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = await User.findById(course.students[0]);
      await new Notification({
        user: student,
        changedCourse: course,
        text: 'Tritratrulala'
      }).save();

      const res = await testHelper.commonUserGetRequest(student, '');
      res.status.should.be.equal(200);
      res.body.forEach((notification: any) => {
        notification._id.should.be.a('string');
        notification.text.should.be.a('string');
      });
    });
  });

  describe(`DELETE ${BASE_URL} :id`, () => {
    it('should delete a notification', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const students = await FixtureUtils.getRandomStudents(2, 5);

      course.students = course.students.concat(students);
      await course.save();

      const newNotification = await new Notification({
        user: students[0],
        changedCourse: course,
        text: 'Tritratrulala'
      }).save();

      const res = await testHelper.commonUserDeleteRequest(students[0], `/${newNotification._id}`);
      res.status.should.be.equal(200);
      const deletedNotification = await Notification.findById(newNotification._id);
      should.not.exist(deletedNotification, 'Notification does still exist');
    });

    it('should fail because the user is not authorized to delete the notification', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const students = await FixtureUtils.getRandomStudents(2, 5);

      const newNotification = await new Notification({
        user: students[0],
        changedCourse: course,
        text: 'Tritratrulala'
      }).save();

      const res = await testHelper.commonUserDeleteRequest(students[1], `/${newNotification._id}`);
      res.status.should.be.equal(404);
      res.body.name.should.be.equal('NotFoundError');
      res.body.message.should.be.equal('Notification could not be found.');
    });
  });
});
