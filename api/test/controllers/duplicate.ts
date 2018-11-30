import * as chai from 'chai';
import {TestHelper} from '../TestHelper';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {ICourse} from '../../../shared/models/ICourse';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import * as util from 'util';
import {Course} from '../../src/models/Course';
import {IUser} from '../../../shared/models/IUser';
import {ICodeKataModel} from '../../src/models/units/CodeKataUnit';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';
import {ITaskUnitModel} from '../../src/models/units/TaskUnit';
import {IFreeTextUnitModel} from '../../src/models/units/FreeTextUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import {extractSingleMongoId} from '../../src/utilities/ExtractMongoId';

// how can i do this in the usual import scheme as above?
// 'track()' needs to be chained to the require in order to be able to delete all created temporary files afterwards
// see also: https://github.com/bruce/node-temp
const temp = require('temp').track();
const createTempFile = util.promisify(temp.open);

chai.use(chaiHttp);
const should = chai.should();
const BASE_URL = '/api/duplicate';
const testHelper = new TestHelper(BASE_URL);

/**
 * Provides simple shared setup functionality used by the duplicate access denial unit tests.
 * It finds a targetCourse (ICourseModel) that doesn't share any of the teachers with the given input course.
 * Then it finds the unauthorizedTeacher, which is simply a random teacher of the targetCourse.
 *
 * @param course The course for which the "unauthorized teacher set" is to be generated.
 * @returns An object with the targetCourse and unauthorizedTeacher.
 */
async function prepareUnauthorizedTeacherSetFor(course: ICourse) {
  const authorizedTeachers = [course.courseAdmin, ...course.teachers];
  const targetCourse = await Course.findOne({
    courseAdmin: {$nin: authorizedTeachers},
    teachers: {$nin: authorizedTeachers}
  });
  const unauthorizedTeacher = await FixtureUtils.getRandomTeacherForCourse(targetCourse);
  return {targetCourse, unauthorizedTeacher};
}

/**
 * Provides simple shared setup functionality used by the duplicate access denial unit tests.
 * It first gets a random teacher for the input course.
 * Then it finds a targetCourse (ICourseModel) for that teacher.
 *
 * @param course The course for which the "other course set" is to be generated.
 * @returns An object with the targetCourse and teacher.
 */
async function prepareOtherTargetCourseSetFor(course: ICourse) {
  const teacher = await FixtureUtils.getRandomTeacherForCourse(course);
  const targetCourse = await Course.findOne({
    courseAdmin: {$ne: teacher},
    teachers: {$ne: teacher}
  });
  return {targetCourse, teacher};
}

async function testForbidden(user: IUser, urlPostfix = '', sendData: object) {
  const result = await testHelper.commonUserPostRequest(user, urlPostfix, sendData);
  result.status.should.be.equal(403);
}

async function testSuccess(user: IUser, urlPostfix = '', sendData: object, errorMsg = '') {
  const response = await testHelper.commonUserPostRequest(user, urlPostfix, sendData);
  response.status.should.be.equal(200, errorMsg + ' -> ' + response.body.message);
  should.exist(response.body._id, 'Response body doesn\'t have an _id property');
  should.equal(1, Object.keys(response.body).length, 'The duplication response apparently contains more than just the ID');
  return response.body._id;
}

async function testNotFound(what: string, sendData?: string | object) {
  const admin = await FixtureUtils.getRandomAdmin();
  const result = await testHelper.commonUserPostRequest(admin, `/${what}/000000000000000000000000`, sendData);
  result.status.should.be.equal(404);
}

describe('Duplicate', async () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should duplicate units', async () => {
      const units = await FixtureUtils.getUnits();

      for (const unit of units) {
        const course = await FixtureUtils.getCourseFromUnit(unit);
        const lecture = await FixtureUtils.getLectureFromUnit(unit);
        const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

        const duplicateId = await testSuccess(teacher, `/unit/${unit._id}`, {lectureId: lecture._id},
          'failed to duplicate ' + unit.name +
          ' into ' + lecture.name +
          ' from ' + course.name);

        const getResponse = await testHelper.basicUserGetRequest(teacher, `/api/units/${duplicateId}`);
        getResponse.status.should.be.equal(200);
        const unitJson: IUnit = getResponse.body;
        // TODO: share this check since it is the same one as in export.ts
        should.equal(unit.name, unitJson.name, 'Duplicate name mismatch');
        // check nullable fields
        if (unit.description != null) {
          unitJson.description.should.be.equal(unit.description);
        } else {
          should.not.exist(unitJson.description);
        }
        if (unit.weight != null) {
          unitJson.weight.should.be.equal(unit.weight);
        } else {
          should.not.exist(unitJson.weight);
        }

        // 'progressableUnits' do have some additional fields
        if (unit.progressable === true) {
          unitJson.progressable.should.be.equal(unit.progressable);
          const progressableUnit = <any>unit;
          if (progressableUnit.deadline != null) {
            (<any>unitJson).deadline.should.be.equal(progressableUnit.deadline);
          }
        }

        (<any>unitJson).__t.should.be.equal((<any>unit).__t);
        // check different types
        switch ((<any>unit).__t) {
          case 'free-text':
            (<IFreeTextUnit>unitJson).markdown.should.be.equal((<IFreeTextUnitModel>unit).markdown);
            break;
          case 'code-kata':
            const codeKataUnit = <ICodeKataModel>unit;
            (<ICodeKataUnit>unitJson).definition.should.be.equal(codeKataUnit.definition);
            (<ICodeKataUnit>unitJson).code.should.be.equal(codeKataUnit.code);
            (<ICodeKataUnit>unitJson).test.should.be.equal(codeKataUnit.test);
            break;
          case 'task':
            const taskUnit = <ITaskUnitModel>unit;
            (<ITaskUnit>unitJson).tasks.should.be.instanceOf(Array).and.have.lengthOf(taskUnit.tasks.length);
            // maybe further test single tasks?
            break;
          default:
            // should this fail the test?
            process.stderr.write('duplicate for "' + unit.type + '" is not completly tested');
            break;
        }
      }
    });

    it('should duplicate lectures', async () => {
      const lectures = await FixtureUtils.getLectures();

      for (const lecture of lectures) {
        const course = await FixtureUtils.getCourseFromLecture(lecture);
        const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

        const duplicateId = await testSuccess(teacher, `/lecture/${lecture._id}`, {courseId: course._id},
          'failed to import ' + lecture.name +
          ' into ' + course.name);

        const getResponse = await testHelper.basicUserGetRequest(teacher, `/api/lecture/${duplicateId}`);
        getResponse.status.should.be.equal(200);
        const lectureJson: ILecture = getResponse.body;
        lectureJson.name.should.be.equal(lecture.name);
        lectureJson.description.should.be.equal(lecture.description);
        lectureJson.units.should.be.instanceOf(Array).and.have.lengthOf(lecture.units.length);

        const updatedCourse = await Course.find({lectures: { $in: [ lectureJson._id ] }});
        updatedCourse.should.be.instanceOf(Array).and.have.lengthOf(1);
        updatedCourse[0]._id.toString().should.be.equal(course._id.toString());
        updatedCourse[0].lectures.should.be.instanceOf(Array).and.have.lengthOf(course.lectures.length + 1);
      }
    });

    it('should duplicate courses', async () => {
      const courses = await FixtureUtils.getCourses();

      for (const course of courses) {
        const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

        const duplicateId = await testSuccess(teacher, `/course/${course._id}`, {courseAdmin: teacher._id},
          'failed to duplicate ' + course.name);

        const getResponse = await testHelper.basicUserGetRequest(teacher, `/api/courses/${duplicateId}/edit`);
        getResponse.status.should.be.equal(200);
        const courseJson: ICourse = getResponse.body;
        courseJson.active.should.be.equal(false);
        courseJson.courseAdmin._id.should.be.equal(extractSingleMongoId(teacher));
        courseJson.name.startsWith(course.name).should.be.equal(true);
        courseJson.description.should.be.equal(course.description);
        courseJson.lectures.should.be.instanceOf(Array).and.have.lengthOf(course.lectures.length);
        // Test optional params
        if (course.accessKey) {
          courseJson.accessKey.should.be.equal(course.accessKey);
        }
      }
    });

    it('should forbid unit duplication for an unauthorized teacher', async () => {
      const unit = await FixtureUtils.getRandomUnit();
      const course = await FixtureUtils.getCourseFromUnit(unit);
      const {targetCourse, unauthorizedTeacher} = await prepareUnauthorizedTeacherSetFor(course);
      const targetLecture = await FixtureUtils.getRandomLectureFromCourse(targetCourse);
      await testForbidden(unauthorizedTeacher, `/unit/${unit._id}`, {lectureId: targetLecture._id});
    });

    it('should forbid lecture duplication for an unauthorized teacher', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const {targetCourse, unauthorizedTeacher} = await prepareUnauthorizedTeacherSetFor(course);
      await testForbidden(unauthorizedTeacher, `/lecture/${lecture._id}`, {courseId: targetCourse._id});
    });

    it('should forbid course duplication for an unauthorized teacher', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const {unauthorizedTeacher} = await prepareUnauthorizedTeacherSetFor(course);
      await testForbidden(unauthorizedTeacher, `/course/${course._id}`, {courseAdmin: unauthorizedTeacher._id});
    });

    it('should forbid unit duplication when given a different target lecture without authorization', async () => {
      const unit = await FixtureUtils.getRandomUnit();
      const course = await FixtureUtils.getCourseFromUnit(unit);
      const {teacher, targetCourse} = await prepareOtherTargetCourseSetFor(course);
      const targetLecture = await FixtureUtils.getRandomLectureFromCourse(targetCourse);
      await testForbidden(teacher, `/unit/${unit._id}`, {lectureId: targetLecture._id});
    });

    it('should forbid lecture duplication when given a different target course without authorization', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const {teacher, targetCourse} = await prepareOtherTargetCourseSetFor(course);
      await testForbidden(teacher, `/lecture/${lecture._id}`, {courseId: targetCourse._id});
    });

    it('should respond with 404 for a unit id that doesn\'t exist', async () => {
      const targetLecture = await FixtureUtils.getRandomLecture();
      await testNotFound('/unit/000000000000000000000000', {lectureId: targetLecture._id});
    });

    it('should respond with 404 for a lecture id that doesn\'t exist', async () => {
      const targetCourse = await FixtureUtils.getRandomCourse();
      await testNotFound('/lecture/000000000000000000000000', {courseId: targetCourse._id});
    });

    it('should respond with 404 for a course id that doesn\'t exist', async () => {
      await testNotFound('/course/000000000000000000000000');
    });

    it('should respond with 404 for a target lecture id that doesn\'t exist (unit duplication)', async () => {
      const unit = await FixtureUtils.getRandomUnit();
      await testNotFound(`/unit/${unit._id}`, {lectureId: '000000000000000000000000'});
    });

    it('should respond with 404 for a target course id that doesn\'t exist (lecture duplication)', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      await testNotFound(`/lecture/${lecture._id}`, {courseId: '000000000000000000000000'});
    });
  });
});
