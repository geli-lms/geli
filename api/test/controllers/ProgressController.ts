import {ICodeKataModel} from '../../src/models/units/CodeKataUnit';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {User, IUserModel} from '../../src/models/User';
import {Unit} from '../../src/models/units/Unit';
import {Course} from '../../src/models/Course';
import * as moment from 'moment';
import {errorCodes} from '../../src/config/errorCodes';

chai.use(chaiHttp);
const BASE_URL = '/api/progress';
const testHelper = new TestHelper(BASE_URL);

/**
 * Common setup function for the unit tests.
 */
async function prepareSetup(unitDeadlineAdd = 0) {
  const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
  const course = await Course.findById(unit._course);
  const student = await User.findById(course.students[0]);

  if (unitDeadlineAdd) {
    unit.deadline = moment().add(unitDeadlineAdd, 'hour').format();
    await unit.save();
  }

  return {unit, course, student};
}

/**
 * Common progress data setup function for the unit tests.
 */
function createProgressObjFor (unit: ICodeKataModel, student: IUserModel, done: Boolean = true) {
  return {
    course: unit._course.toString(),
    unit: unit._id.toString(),
    user: student._id.toString(),
    code: 'let a = test;',
    done,
    type: 'codeKata'
  };
}

/**
 * Common unit test helper function to check that responses equal the progress object.
 */
function checkResponseProgress (res: any, newProgress: any) {
  res.body.course.should.be.equal(newProgress.course);
  res.body.unit.should.be.equal(newProgress.unit);
  res.body.user.should.be.equal(newProgress.user);
  res.body.done.should.be.equal(newProgress.done);
  res.body._id.should.be.a('string');
}

/**
 * Common helper function for the unit tests that PUT new progress data for a student and checks the status code.
 */
async function putProgressTestData (unit: ICodeKataModel, student: IUserModel, status: Number = 200) {
  const newProgress = createProgressObjFor(unit, student);
  const res = await testHelper.commonUserPutRequest(student, '', newProgress);
  res.status.should.be.equal(status);
  return {res, newProgress};
}

describe('ProgressController', () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`GET ${BASE_URL}`, () => {
    it('should get unit progress', async () => {
      const {unit, student} = await prepareSetup();

      const res = await testHelper.commonUserGetRequest(student, `/units/${unit._id}`);
      res.status.should.be.equal(200);
    });

    it('should deny access to unit progress for an unauthorized user', async () => {
      const {unit, course} = await prepareSetup();
      const unauthorizedUser = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const res = await testHelper.commonUserGetRequest(unauthorizedUser, `/units/${unit._id}`);
      res.status.should.be.equal(403);
    });

    it('should only return own unit progress for a student', async () => {
      const {unit, course, student} = await prepareSetup(1);
      // Currently the FixtureLoader will enrol at least 2 students per course, so this should never fail.
      const student2 = await User.findById(course.students[1]);
      await Promise.all([putProgressTestData(unit, student), putProgressTestData(unit, student2)]);

      const res = await testHelper.commonUserGetRequest(student, `/units/${unit._id}`);
      res.status.should.be.equal(200);
      res.body.should.not.be.empty;
      const studentId = student._id.toString();
      res.body.forEach((progress: any) => progress.user.should.equal(studentId));
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    async function successTest (unitDeadlineAdd: number) {
      const {unit, student} = await prepareSetup(unitDeadlineAdd);
      const progress = (await putProgressTestData(unit, student)).res.body;
      const {res, newProgress} = await putProgressTestData(unit, student);
      checkResponseProgress(res, newProgress);
      res.body._id.should.be.equal(progress._id.toString(), 'Progress update ID mismatch');
    }

    it('should update progress for some progressable unit', async () => {
      await successTest(0);
    });

    it('should update progress for some progressable unit with a deadline', async () => {
      await successTest(1);
    });

    it('should fail updating progress for some progressable unit with a deadline', async () => {
      const {unit, student} = await prepareSetup(-1);
      const {res} = await putProgressTestData(unit, student, 400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal(errorCodes.progress.pastDeadline.text);
    });

    it('should fail to update progress for an unauthorized student', async () => {
      const {unit, course} = await prepareSetup();
      const unauthorizedStudent = await FixtureUtils.getUnauthorizedStudentForCourse(course);
      await putProgressTestData(unit, unauthorizedStudent, 403);
    });
  });
});
