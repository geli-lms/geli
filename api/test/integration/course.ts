import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Course, ICourseModel} from '../../src/models/Course';
import {ICourse} from '../../../shared/models/ICourse';
import {ICourseView} from '../../../shared/models/ICourseView';
import {IUserSubCourseView} from '../../../shared/models/IUserSubCourseView';
import {IUser} from '../../../shared/models/IUser';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import {readFileSync} from 'fs';
import {BreakpointSize} from '../../src/models/BreakpointSize';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/courses';
const fixtureLoader = new FixtureLoader();

describe('Course', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, () => {
    it('should return all active courses', async () => {
      const courses = await Course.find({active: true});
      const student = await FixtureUtils.getRandomStudent();

      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`);
      res.status.should.be.equal(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(courses.length);

      res.body.forEach((course: any) => {
        course._id.should.be.a('string');
        course.name.should.be.a('string');
        course.active.should.be.a('boolean');
        course.active.should.be.equal(true);
      });
    });


    it('should return all courses', async () => {
      const courses = await Course.find();
      const teacher = await FixtureUtils.getRandomTeacher();
      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`);
      res.status.should.be.equal(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(courses.length);

      res.body.forEach((course: any) => {
        course._id.should.be.a('string');
        course.name.should.be.a('string');
        course.active.should.be.a('boolean');
        course.active.should.be.oneOf([true, false]);
      });
    });

    it('should fail with wrong authorization', async () => {
      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);
        res.status.should.be.equal(401);
    });


    it('should have a course fixture with "accesskey" enrollType', async () => {
      const course = await Course.findOne({enrollType: 'accesskey'});
      should.exist(course);
    });

    it('should not leak access keys to students', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const res = await chai.request(app)
        .get(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`);
      res.status.should.be.equal(200);

      res.body.forEach((course: any) => {
        should.equal(course.accessKey, undefined);
      });
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should add a new course', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const testData = {
        name: 'Test Course',
        description: 'Test description'
      };

      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(testData);
      res.status.should.be.equal(200);
      res.body.name.should.equal(testData.name);
      res.body.description.should.equal(testData.description);
    });
  });


  describe(`GET ${BASE_URL} :id`, () => {
    async function prepareTestCourse() {
      const teachers = await FixtureUtils.getRandomTeachers(2, 2);
      const teacher = teachers[0];
      const unauthorizedTeacher = teachers[1];
      const student = await FixtureUtils.getRandomStudent();
      const testData = new Course({
        name: 'Test Course',
        description: 'Test description',
        active: true,
        courseAdmin: teacher,
        teachers: [teacher],
        enrollType: 'accesskey',
        accessKey: 'accessKey1234',
        students: [student]
      });
      const savedCourse = await testData.save();
      return {teacher, unauthorizedTeacher, student, testData, savedCourse};
    }

    async function testUnauthorizedGetCourseEdit(savedCourse: ICourseModel, user: IUser) {
      const res = await chai.request(app)
        .get(`${BASE_URL}/${savedCourse._id}/edit`)
        .set('Cookie', `token=${JwtUtils.generateToken(user)}`);

      res.should.not.have.status(200);
      return res;
    }

    function assertUserCourseViewEquality(actual: IUserSubCourseView, expected: IUserSubCourseView) {
      actual._id.should.be.equal(expected._id.toString());
      actual.profile.firstName.should.be.equal(expected.profile.firstName);
      actual.profile.lastName.should.be.equal(expected.profile.lastName);
      actual.email.should.be.equal(expected.email);
    }

    it('should get view info for course with given id', async () => {
      const {student, testData, savedCourse} = await prepareTestCourse();

      const res = await chai.request(app)
        .get(`${BASE_URL}/${savedCourse._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`);

      res.should.have.status(200);

      const body: ICourseView = res.body;
      body.name.should.be.equal(testData.name);
      body.description.should.be.equal(testData.description);
      assertUserCourseViewEquality(body.courseAdmin, testData.courseAdmin);
      for (const [index, actual] of body.teachers.entries()) {
        assertUserCourseViewEquality(actual, testData.teachers[index]);
      }

      should.equal(res.body.accessKey, undefined);
    });

    it('should get edit info for course with given id', async () => {
      const {teacher, testData, savedCourse} = await prepareTestCourse();

      const res = await chai.request(app)
        .get(`${BASE_URL}/${savedCourse._id}/edit`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`);

      res.should.have.status(200);

      const body: ICourse = res.body;
      body.name.should.be.equal(testData.name);
      body.description.should.be.equal(testData.description);
      body.active.should.be.equal(testData.active);
      body.enrollType.should.be.equal(testData.enrollType);
      body.accessKey.should.be.equal(testData.accessKey);
    });

    it('should not get edit info for course as student', async () => {
      const {savedCourse, student} = await prepareTestCourse();
      const res = await testUnauthorizedGetCourseEdit(savedCourse, student);
      res.body.name.should.be.equal('AccessDeniedError');
      res.body.should.have.property('message');
      res.body.should.have.property('stack');
    });

    it('should not get edit info for course as unauthorized teacher', async () => {
      const {savedCourse, unauthorizedTeacher} = await prepareTestCourse();
      const res = await testUnauthorizedGetCourseEdit(savedCourse, unauthorizedTeacher);
      res.body.name.should.be.oneOf(['NotFoundError', 'ForbiddenError']);
      res.body.should.have.property('stack');
    });

    it('should not get course not a teacher of course', async () => {
      const teacher = await FixtureUtils.getRandomTeachers(2, 2);
      const testData = new Course({
        name: 'Test Course',
        description: 'Test description',
        active: true,
        courseAdmin: teacher[0]._id
      });
      const savedCourse = await testData.save();

      const res = await chai.request(app)
        .get(`${BASE_URL}/${savedCourse._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher[1])}`)
        .catch(err => err.response);

      res.should.have.status(404);
    });
  });

  describe(`PUT ${BASE_URL} :id`, () => {
    it('change added course', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const testDataUpdate = new Course(
        {
          name: 'Test Course Update',
          description: 'Test description update',
          active: true,
          courseAdmin: teacher._id
        });
      const testData = new Course(
        {
          name: 'Test Course',
          description: 'Test description',
          active: false,
          courseAdmin: teacher._id
        });
      const savedCourse = await testData.save();
      testDataUpdate._id = savedCourse._id;

      let res = await chai.request(app)
        .put(`${BASE_URL}/${testDataUpdate._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(testDataUpdate);

      res.should.have.status(200);
      res.body.name.should.be.eq(testDataUpdate.name);
      res.body._id.should.be.eq(testDataUpdate.id);

      res = await chai.request(app)
        .get(`${BASE_URL}/${res.body._id}/edit`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`);

      res.should.have.status(200);
      res.body.name.should.be.eq(testDataUpdate.name);
      res.body.description.should.be.eq(testDataUpdate.description);
      res.body.active.should.be.eq(testDataUpdate.active);
    });

    it('should not change course not a teacher of course', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const testData = new Course(
        {
          name: 'Test Course',
          description: 'Test description',
          active: false
        });
      const savedCourse = await testData.save();
      const res = await chai.request(app)
        .put(`${BASE_URL}/${savedCourse._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .send(savedCourse)
        .catch(err => err.response);

      res.should.have.status(404);
    });
  });


  describe(`POST PICTURE ${BASE_URL}`, () => {
    it('should update the course image', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .post(`${BASE_URL}/picture/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .attach('file', readFileSync('test/resources/test.png'), 'test.png')
        .field('imageData', JSON.stringify({ breakpoints:
          [ { screenSize: BreakpointSize.MOBILE, imageSize: { width: 284, height: 190} }] }));

      res.should.have.status(200);
      res.body.breakpoints.length.should.be.eq(1);
    });

    it('should update the course image with only the width set', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .post(`${BASE_URL}/picture/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .attach('file', readFileSync('test/resources/test.png'), 'test.png')
        .field('imageData', JSON.stringify({ breakpoints:
          [ { screenSize: BreakpointSize.MOBILE, imageSize: { width: 284 } }] }));

      res.should.have.status(200);
      res.body.breakpoints.length.should.be.eq(1);
    });

    it('should update the course image with only the height set', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .post(`${BASE_URL}/picture/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .attach('file', readFileSync('test/resources/test.png'), 'test.png')
        .field('imageData', JSON.stringify({ breakpoints:
          [ { screenSize: BreakpointSize.MOBILE, imageSize: { height: 190 } }] }));

      res.should.have.status(200);
      res.body.breakpoints.length.should.be.eq(1);
    });

    it('should not update the course image (wrong file type)', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .post(`${BASE_URL}/picture/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .attach('file', readFileSync('test/resources/wrong-format.rtf'), 'test.png')
        .field('imageData', JSON.stringify({ breakpoints:
          [ { screenSize: BreakpointSize.MOBILE, imageSize: { width: 284, height: 190} }] }));

      res.should.not.have.status(200);
    });
  });

  describe(`DELETE PICTURE ${BASE_URL}`, () => {
    it('should update and remove the course image', async () => {

      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      let res = await chai.request(app)
        .post(`${BASE_URL}/picture/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .attach('file', readFileSync('test/resources/test.png'), 'test.png')
        .field('imageData', JSON.stringify({
          breakpoints:
            [{screenSize: BreakpointSize.MOBILE, imageSize: {width: 284, height: 190}}]
        }));

      res.should.have.status(200);
      res.body.breakpoints.length.should.be.eq(1);


      res = await chai.request(app)
        .del(`${BASE_URL}/picture/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .send();

      res.should.have.status(200);

      const updatedCourse = await Course.findById(course._id);
      should.not.exist(updatedCourse.image);

    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    it('should delete the Course', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .del(`${BASE_URL}/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`);

      res.status.should.be.equal(200);
      const deletedCourse = await Course.findById(course._id);
      should.not.exist(deletedCourse, 'Course does still exist');
    });

    it('should fail because the user is not authorized', async () => {
      const course = await FixtureUtils.getRandomCourse();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${course._id}`)
        .catch(err => err.response);

      res.status.should.be.equal(401);
    });

    it('should fail because the teacher is not in the course', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const allTeachersAndAdmins = course.teachers;
      allTeachersAndAdmins.push(course.courseAdmin);
      const user = await User.findOne({
        $and: [
          {role: 'teacher'},
          {_id: {$nin: allTeachersAndAdmins}}
        ]
      });
      const res = await chai.request(app)
        .del(`${BASE_URL}/${course._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
        .catch(err => err.response);

      res.status.should.be.equal(403);
    });
  });
});
