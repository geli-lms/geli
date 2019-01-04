import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../TestHelper';
import {ICourseModel} from '../../src/models/Course';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {Lecture, ILectureModel} from '../../src/models/Lecture';
import {IUser} from '../../../shared/models/IUser';

chai.use(chaiHttp);
const should = chai.should();
const BASE_URL = '/api/lecture';
const testHelper = new TestHelper(BASE_URL);

/**
 * Provides simple shared setup functionality used by the lecture success (200) unit tests.
 *
 * @returns A random 'lecture', its 'course' and a random 'admin'. The 'admin' is also aliased as 'user'.
 */
async function lectureSuccessTestSetup() {
  const lecture = await FixtureUtils.getRandomLecture();
  const course = await FixtureUtils.getCourseFromLecture(lecture);
  const admin = await FixtureUtils.getRandomAdmin();
  return {lecture, course, admin, user: admin};
}

/**
 * Provides simple shared setup functionality used by the lecture access denial (403) unit tests.
 *
 * @returns A 'lecture', its 'course' and an 'unauthorizedTeacher' (i.e. a teacher that isn't part of the course).
 *          The 'unauthorizedTeacher' is also aliased as 'user'.
 */
async function lectureAccessDenialTestSetup() {
  const lecture = await FixtureUtils.getRandomLecture();
  const course = await FixtureUtils.getCourseFromLecture(lecture);
  const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);
  return {lecture, course, unauthorizedTeacher, user: unauthorizedTeacher};
}

/**
 * Provides simple shared setup functionality used by the lecture not found (404) unit tests.
 *
 * @returns Same as lectureSuccessTestSetup, but the lecture & course ids are set to 000000000000000000000000.
 */
async function lectureNotFoundTestSetup() {
  const setup = await lectureSuccessTestSetup();
  setup.lecture._id = '000000000000000000000000';
  setup.course._id = '000000000000000000000000';
  return setup;
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
    async function lectureGetTest({lecture, user}: {lecture: ILectureModel, user: IUser}) {
      return await testHelper.commonUserGetRequest(user, `/${lecture.id}`);
    }

    it('should get lecture data', async () => {
      const setup = await lectureSuccessTestSetup();
      const res = await lectureGetTest(setup);
      lectureShouldEqualRes(setup.lecture, res);
    });

    it('should forbid lecture access for an unauthorized user', async () => {
      const res = await lectureGetTest(await lectureAccessDenialTestSetup());
      res.status.should.be.equal(403);
    });

    it('should respond with 404 for an invalid lecture id', async () => {
      const res = await lectureGetTest(await lectureNotFoundTestSetup());
      res.status.should.be.equal(404);
    });
  });

  describe(`POST ${BASE_URL}` , () => {
    async function lecturePostTest({lecture, course, user}: {lecture: ILectureModel, course: ICourseModel, user: IUser}) {
      return await testHelper.commonUserPostRequest(user, `/`, {
        name: lecture.name,
        description: lecture.description,
        courseId: course.id
      });
    }

    it('should add a lecture', async () => {
      const res = await lecturePostTest(await lectureSuccessTestSetup());
      res.status.should.be.equal(200);
    });

    it('should forbid lecture addition for an unauthorized teacher', async () => {
      const res = await lecturePostTest(await lectureAccessDenialTestSetup());
      res.status.should.be.equal(403);
    });

    it('should respond with 404 for an invalid course id', async () => {
      const res = await lecturePostTest(await lectureNotFoundTestSetup());
      res.status.should.be.equal(404);
    });
  });

  describe(`PUT ${BASE_URL}` , () => {
    async function lecturePutTest({lecture, user}: {lecture: ILectureModel, user: IUser}) {
      lecture.description = 'Lecture modification unit test.';
      return await testHelper.commonUserPutRequest(user, `/${lecture.id}`, lecture);
    }

    it('should modify a lecture', async () => {
      const setup = await lectureSuccessTestSetup();
      const res = await lecturePutTest(setup);
      lectureShouldEqualRes(setup.lecture, res);
    });

    it('should forbid lecture modification for an unauthorized teacher', async () => {
      const res = await lecturePutTest(await lectureAccessDenialTestSetup());
      res.status.should.be.equal(403);
    });

    it('should respond with 404 for an invalid lecture id', async () => {
      const res = await lecturePutTest(await lectureNotFoundTestSetup());
      res.status.should.be.equal(404);
    });
  });

  describe(`DELETE ${BASE_URL}` , () => {
    async function lectureDeleteTest({lecture, user}: {lecture: ILectureModel, user: IUser}) {
      return await testHelper.commonUserDeleteRequest(user, `/${lecture.id}`);
    }

    it('should delete a lecture', async () => {
      const setup = await lectureSuccessTestSetup();
      const res = await lectureDeleteTest(setup);
      res.status.should.be.equal(200);
      should.not.exist(await Lecture.findById(setup.lecture.id), 'Lecture still exists');
    });

    it('should forbid lecture deletions for an unauthorized teacher', async () => {
      const res = await lectureDeleteTest(await lectureAccessDenialTestSetup());
      res.status.should.be.equal(403);
    });

    it('should respond with 404 for an invalid lecture id', async () => {
      const res = await lectureDeleteTest(await lectureNotFoundTestSetup());
      res.status.should.be.equal(404);
    });
  });

});
