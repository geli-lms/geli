import * as chai from 'chai';
import {TestHelper} from '../TestHelper';
import {Course} from '../../src/models/Course';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import {Lecture, ILectureModel} from '../../src/models/Lecture';

chai.use(chaiHttp);
const should = chai.should();
const BASE_URL = '/api/lecture';
const testHelper = new TestHelper(BASE_URL);

/**
 * Provides simple shared setup functionality used by the lecture success (200) unit tests.
 *
 * @returns A random 'admin' and 'lecture'.
 */
async function lectureSuccessTestSetup() {
  const lecture = await FixtureUtils.getRandomLecture();
  const course = await FixtureUtils.getCourseFromLecture(lecture);
  const admin = await FixtureUtils.getRandomAdmin();
  return {lecture, course, admin};
}

/**
 * Provides simple shared setup functionality used by the lecture access denial (403) unit tests.
 *
 * @returns A 'lecture', its 'course' and an 'unauthorizedTeacher' (i.e. a teacher that isn't part of the course).
 */
async function lectureAccessDenialTestSetup() {
  const lecture = await FixtureUtils.getRandomLecture();
  const course = await FixtureUtils.getCourseFromLecture(lecture);
  const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);
  return {lecture, course, unauthorizedTeacher};
}

function lectureShouldEqualRes(lecture: ILectureModel, res: any) {
  res.status.should.be.equal(200);
  should.equal(lecture.id, res.body._id, 'Incorrect id.');
  should.equal(lecture.name, res.body.name, 'Incorrect name.');
  should.equal(lecture.description, res.body.description, 'Incorrect description.');
}

describe('Lecture', () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`GET ${BASE_URL}` , () => {
    it('should get lecture data', async () => {
      const {lecture, admin} = await lectureSuccessTestSetup();
      const res = await testHelper.commonUserGetRequest(admin, `/${lecture.id}`);
      lectureShouldEqualRes(lecture, res);
    });

    it('should forbid lecture access for an unauthorized user', async () => {
      const {lecture, unauthorizedTeacher} = await lectureAccessDenialTestSetup();
      const res = await testHelper.commonUserGetRequest(unauthorizedTeacher, `/${lecture.id}`);
      res.status.should.be.equal(403);
    });
  });

  describe(`POST ${BASE_URL}` , () => {
    it('should add a lecture', async () => {
      const {lecture, course, admin} = await lectureSuccessTestSetup();
      const res = await testHelper.commonUserPostRequest(admin, `/`, {
        lecture: {name: lecture.name, description: lecture.description},
        courseId: course.id
      });
      res.status.should.be.equal(200);
    });

    it('should forbid lecture addition for an unauthorized teacher', async () => {
      const {lecture, course, unauthorizedTeacher} = await lectureAccessDenialTestSetup();
      const res = await testHelper.commonUserPostRequest(unauthorizedTeacher, `/`, {
        lecture: {name: lecture.name, description: lecture.description},
        courseId: course.id
      });
      res.status.should.be.equal(403);
    });
  });

  describe(`PUT ${BASE_URL}` , () => {
    it('should modify a lecture', async () => {
      const {lecture, admin} = await lectureSuccessTestSetup();
      lecture.description = 'Lecture modification unit test.';
      const res = await testHelper.commonUserPutRequest(admin, `/${lecture.id}`, lecture);
      lectureShouldEqualRes(lecture, res);
    });

    it('should forbid lecture modification for an unauthorized teacher', async () => {
      const {lecture, unauthorizedTeacher} = await lectureAccessDenialTestSetup();
      const res = await testHelper.commonUserPutRequest(unauthorizedTeacher, `/${lecture.id}`, lecture);
      res.status.should.be.equal(403);
    });
  });

  describe(`DELETE ${BASE_URL}` , () => {
    it.only('should delete a lecture by course admin', async () => {
      const {lecture, course, admin} = await lectureSuccessTestSetup();
      const res = await testHelper.commonUserDeleteRequest(admin, `/${lecture.id}`);
      res.status.should.be.equal(200);

      const courseWithDeletedLecture = await Course.findById(course.id);
      courseWithDeletedLecture.lectures[0].should.not.be.equal(lecture.id);
      const deletedLecture = await Lecture.findById(lecture.id);
      should.not.exist(deletedLecture, 'Lecture still exists');
    });

    it('should forbid lecture deletions for an unauthorized teacher', async () => {
      const {lecture, unauthorizedTeacher} = await lectureAccessDenialTestSetup();
      const res = await testHelper.commonUserDeleteRequest(unauthorizedTeacher, `/${lecture.id}`);
      res.status.should.be.equal(403);
    });
  });

});
