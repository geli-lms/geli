import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {Notification} from '../../src/models/Notification';
import {IUser} from '../../../shared/models/IUser';
import {User, IUserModel} from '../../src/models/User';
import {ICourseModel} from '../../src/models/Course';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, API_NOTIFICATION_TYPE_NONE, NotificationSettings} from '../../src/models/NotificationSettings';
import {errorCodes} from '../../src/config/errorCodes';

chai.use(chaiHttp);
const should = chai.should();
const BASE_URL = '/api/notification';
const testHelper = new TestHelper(BASE_URL);

/**
 * Common setup function for the notification creation (POST) routes.
 */
async function preparePostSetup() {
  const course = await FixtureUtils.getRandomCourse();
  const student = course.students[Math.floor(Math.random() * course.students.length)];
  const teacher = await FixtureUtils.getRandomTeacherForCourse(course);
  return {course, student, teacher};
}

/**
 * Common setup function for the notification creation (POST) routes with a changed course.
 */
async function preparePostChangedCourseSetup() {
  const setup = await preparePostSetup();
  const {course} = setup;
  course.active = true;
  await course.save();
  const newNotification = {
    targetId: course.id,
    targetType: 'course',
    text: 'test text'
  };
  return {...setup, newNotification};
}

/**
 * Common setup function for the notification creation (POST) routes with invalid targetId.
 */
async function preparePostNotFoundSetup(targetType: string) {
  const setup = await preparePostSetup();
  const newNotification = {
    targetType,
    targetId: '000000000000000000000000',
    text: 'test text'
  };
  return {...setup, newNotification};
}

/**
 * 'should respond with 400 for an invalid targetType'
 *
 * @param urlPostfixAssembler Function that is given a student and returns a urlPostfix string for the commonUserPostRequest.
 */
async function invalidTargetTypePostTest(urlPostfixAssembler: (student: IUser) => string) {
  const {student, teacher, newNotification} = await preparePostChangedCourseSetup();
  newNotification.targetType = 'some-invalid-targetType';

  const res = await testHelper.commonUserPostRequest(teacher, urlPostfixAssembler(student), newNotification);
  res.status.should.be.equal(400);
  res.body.message.should.be.equal(errorCodes.notification.invalidTargetType.text);
}

/**
 * 'should respond with 404 for an invalid course/lecture/unit id target'
 *
 * @param urlPostfixAssembler Function that is given a student and returns a urlPostfix string for the commonUserPostRequest.
 */
async function notFoundPostTest (targetType: string, urlPostfixAssembler: (student: IUser) => string) {
  const {teacher, student, newNotification} = await preparePostNotFoundSetup(targetType);
  const res = await testHelper.commonUserPostRequest(teacher, urlPostfixAssembler(student), newNotification);
  res.status.should.be.equal(404);
}

describe('Notifications', async () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`POST ${BASE_URL}`, async () => {
    /**
     * For the PostNotifications route this can simply return '' without doing anything.
     */
    function urlPostfixAssembler() {
      return '';
    }

    it('should fail if text parameter is not given', async () => {
      const {course, teacher} = await preparePostSetup();

      const newNotification = {
        targetId: course.id,
        targetType: 'course'
      };

      const res = await testHelper.commonUserPostRequest(teacher, '', newNotification);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('ParamRequiredError');
    });

    it('should create notifications for students with the corresponding settings', async () => {
      const {course, teacher, newNotification} = await preparePostChangedCourseSetup();

      const res = await testHelper.commonUserPostRequest(teacher, '', newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(course.students.length);
    });

    it('should forbid notification creation for an unauthorized teacher', async () => {
      const {course, newNotification} = await preparePostChangedCourseSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const res = await testHelper.commonUserPostRequest(unauthorizedTeacher, '', newNotification);
      res.status.should.be.equal(403);
    });

    it('should respond with 404 for an invalid course id target', async () => {
      await notFoundPostTest('course', urlPostfixAssembler);
    });

    it('should respond with 404 for an invalid lecture id target', async () => {
      await notFoundPostTest('lecture', urlPostfixAssembler);
    });

    it('should respond with 404 for an invalid unit id target', async () => {
      await notFoundPostTest('unit', urlPostfixAssembler);
    });

    it('should respond with 400 for an invalid targetType', async () => {
      await invalidTargetTypePostTest(urlPostfixAssembler);
    });
  });

  describe(`POST ${BASE_URL} user :id`, async () => {
    /**
     * For the PostNotification route this will use the given student to return /user/${student._id}.
     */
    function urlPostfixAssembler(student: IUser) {
      return `/user/${student._id}`;
    }

    interface IChangedCourseSuccessTest {
      course: ICourseModel;
      teacher: IUserModel;
      student: IUser;
      newNotification: any;
    }
    async function changedCourseSuccessTest ({course, teacher, student, newNotification}: IChangedCourseSuccessTest) {
      const res = await testHelper.commonUserPostRequest(teacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(200);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    }

    it('should fail if required parameters are omitted', async () => {
      const {teacher} = await preparePostSetup();

      const res = await testHelper.commonUserPostRequest(teacher, '/user/507f191e810c19729de860ea', {});
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('ParamRequiredError');
    });

    it('should fail if user not given', async () => {
      const {course, teacher} = await preparePostSetup();

      const newNotification = {
        targetId: course.id,
        targetType: 'course',
        text: 'test text'
      };

      const res = await testHelper.commonUserPostRequest(teacher, '/user/507f191e810c19729de860ea', newNotification);
      res.status.should.be.equal(404);
      res.body.message.should.be.equal(errorCodes.notification.targetUserNotFound.text);
    });

    it('should create notifications for student with changedCourse and text', async () => {
      await changedCourseSuccessTest(await preparePostChangedCourseSetup());
    });

    it('should create notifications for student with changedCourse and text', async () => {
      const setup = await preparePostChangedCourseSetup();

      await new NotificationSettings({
        user: setup.student,
        course: setup.course,
        notificationType: API_NOTIFICATION_TYPE_ALL_CHANGES,
        emailNotification: true
      }).save();

      await changedCourseSuccessTest(setup);
    });

    it('should create notifications for student with changedCourse, changedLecture, changedUnit and text', async () => {
      const {course, student, teacher} = await preparePostChangedCourseSetup();
      const lecture = await FixtureUtils.getRandomLectureFromCourse(course);
      const unit = await FixtureUtils.getRandomUnitFromLecture(lecture);
      unit.visible = true;
      await unit.save();

      const newNotification = {
        targetId: unit.id,
        targetType: 'unit',
        text: 'test text'
      };

      await changedCourseSuccessTest({course, student, teacher, newNotification});
    });

    it('should create notifications for student with changedCourse and text but API_NOTIFICATION_TYPE_NONE', async () => {
      const setup = await preparePostChangedCourseSetup();

      await new NotificationSettings({
        user: setup.student,
        course: setup.course,
        notificationType: API_NOTIFICATION_TYPE_NONE,
        emailNotification: false
      }).save();

      await changedCourseSuccessTest(setup);
    });

    it('should create notifications for student with text only', async () => {
      const {student, teacher} = await preparePostSetup();

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
      const {course, student, newNotification} = await preparePostChangedCourseSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const res = await testHelper.commonUserPostRequest(unauthorizedTeacher, `/user/${student._id}`, newNotification);
      res.status.should.be.equal(403);
    });

    it('should respond with 404 for an invalid course id target', async () => {
      await notFoundPostTest('course', urlPostfixAssembler);
    });

    it('should respond with 404 for an invalid lecture id target', async () => {
      await notFoundPostTest('lecture', urlPostfixAssembler);
    });

    it('should respond with 404 for an invalid unit id target', async () => {
      await notFoundPostTest('unit', urlPostfixAssembler);
    });

    it('should respond with 400 for an invalid targetType', async () => {
      await invalidTargetTypePostTest(urlPostfixAssembler);
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

    it('should respond with 404 for a notification id that doesn\'t belong to the user', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const students = await FixtureUtils.getRandomStudents(2, 5);

      const newNotification = await new Notification({
        user: students[0],
        changedCourse: course,
        text: 'Tritratrulala'
      }).save();

      const res = await testHelper.commonUserDeleteRequest(students[1], `/${newNotification._id}`);
      res.status.should.be.equal(404);
    });
  });
});
