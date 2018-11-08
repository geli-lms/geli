import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Notification} from '../../src/models/Notification';
import chaiHttp = require('chai-http');
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
import {NotFoundError} from 'routing-controllers';
import {API_NOTIFICATION_TYPE_ALL_CHANGES, API_NOTIFICATION_TYPE_NONE, NotificationSettings} from '../../src/models/NotificationSettings';
import {InternalServerError} from 'routing-controllers/http-error/InternalServerError';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/notification';
const fixtureLoader = new FixtureLoader();

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
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification)
        .catch(err => err.response);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Notification needs at least the fields course and text');
    });

    it('should create notifications for students with the corresponding settings', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        changedCourse: course,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(course.students.length);
    });
  });

  describe(`POST ${BASE_URL} user :id`, async () => {
    it('should fail if course and text are not given', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/507f191e810c19729de860ea`) // valid id but user not exist
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send({})
        .catch(err => err.response);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Notification needs at least the field changedCourse or text');
    });

    it('should fail if user not given', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        changedCourse: course,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/507f191e810c19729de860ea`) // valid id but user not exist
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification)
        .catch(err => err.response);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Could not create notification because user not found');
    });

    it('should create notifications for student with changedCourse and text', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        changedCourse: course,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with changedCourse and text', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      await new NotificationSettings({
        user: student,
        course: course,
        notificationType: API_NOTIFICATION_TYPE_ALL_CHANGES,
        emailNotification: true
      }).save();

      const newNotification = {
        changedCourse: course,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with changedCourse, changedLecture, changedUnit and text', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      const lecture = await FixtureUtils.getRandomLectureFromCourse(course);
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);
      const unit = lecture.units.pop();
      unit.visible = true;

      const newNotification = {
        changedCourse: course,
        changedLecture: lecture,
        changedUnit: unit,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with changedCourse and text but API_NOTIFICATION_TYPE_NONE', async () => {
      const course = await FixtureUtils.getRandomCourse();
      course.active = true;
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      await new NotificationSettings({
        user: student,
        course: course,
        notificationType: API_NOTIFICATION_TYPE_NONE,
        emailNotification: false
      }).save();

      const newNotification = {
        changedCourse: course,
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({changedCourse: course});
      notifications.length.should.be.equal(1);
    });

    it('should create notifications for student with text only', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = course.students[Math.floor(Math.random() * course.students.length)];
      const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

      const newNotification = {
        text: 'test text'
      };

      const res = await chai.request(app)
        .post(`${BASE_URL}/user/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(newNotification);
      res.status.should.be.equal(200);
      res.body.notified.should.be.equal(true);

      const notifications = await Notification.find({user: student._id});
      notifications.length.should.be.equal(1);
    });
  });

  describe(`GET ${BASE_URL} user :id`, () => {
    it('should return all notifications for one user', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const student = await User.findById(course.students[0]);
      const newNotification = await new Notification({
        user: student,
        changedCourse: course,
        text: 'Tritratrulala'
      }).save();

      const res = await chai.request(app)
        .get(`${BASE_URL}/user/${student._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`);
      res.status.should.be.equal(200);
      res.body.forEach((notification: any) => {
        notification._id.should.be.a('string');
        notification.user._id.toString().should.be.equal(student._id.toString());
        notification.text.should.be.a('string');
      });
    });
  });

  describe(`DELETE ${BASE_URL} :id`, () => {
    it('should delete a notification', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const students = await FixtureUtils.getRandomStudents(2, 5);
      course.students = course.students.concat(students);
      await Course.update(course, {new: true});

      const newNotification = await new Notification({
        user: students[0],
        changedCourse: course,
        text: 'Tritratrulala'
      }).save();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${newNotification._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(students[0])}`);

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

      const res = await chai.request(app)
        .del(`${BASE_URL}/${newNotification._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(students[1])}`)
        .catch(err => err.response);

      res.status.should.be.equal(404);
      res.body.name.should.be.equal('NotFoundError');
      res.body.message.should.be.equal('Notification could not be found.');

    });
  });
});
