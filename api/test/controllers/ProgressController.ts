import {ICodeKataModel} from '../../src/models/units/CodeKataUnit';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {User, IUserModel} from '../../src/models/User';
import {Unit} from '../../src/models/units/Unit';
import {Lecture} from '../../src/models/Lecture';
import {Course} from '../../src/models/Course';
import {Progress} from '../../src/models/progress/Progress';
import * as moment from 'moment';

chai.use(chaiHttp);
const BASE_URL = '/api/progress';
const testHelper = new TestHelper(BASE_URL);

/**
 * Common setup function for the unit tests.
 */
async function prepareSetup(updateUnitDeadline = false) {
  const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
  const course = await Course.findById(unit._course);
  const student = await User.findOne({_id: course.students[0] });

  if (updateUnitDeadline) {
    unit.deadline = moment().add(1, 'hour').format();
    await unit.save();
  }

  return {unit, course, student};
}

/**
 * Common progress data setup function for the unit tests.
 */
function createNewProgressFor (unit: ICodeKataModel, student: IUserModel) {
  return {
    course: unit._course,
    unit: unit._id.toString(),
    user: student._id.toString(),
    code: 'let a = test;',
    done: true,
    type: 'codeKata'
  };
}

/**
 * Helper function for the get route student filter unit test.
 */
async function postProgressTestData (unit: ICodeKataModel, student: IUserModel) {
  const newProgress = createNewProgressFor(unit, student);
  const resPost = await testHelper.commonUserPostRequest(student, '', newProgress);
  resPost.status.should.be.equal(200);
}

describe('ProgressController', () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`GET ${BASE_URL}`, () => {
    it('should get unit progress', async () => {
      const unit = await FixtureUtils.getRandomUnit();
      const course = await FixtureUtils.getCourseFromUnit(unit);
      const user = await FixtureUtils.getRandomTeacherForCourse(course);

      const res = await testHelper.commonUserGetRequest(user, `/units/${unit._id}`);
      res.status.should.be.equal(200);
    });

    // The corresponding route has been disabled since it appears to be unused and insufficiently secured.
    /*
    it('should get course progress', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const user = await FixtureUtils.getRandomTeacherForCourse(course);

      const res = await testHelper.commonUserGetRequest(user, `/courses/${course._id}`);
      res.status.should.be.equal(200);
    });
    */

    // The corresponding route has been disabled since it appears to be unused and insufficiently secured.
    /*
    it('should get student user progress', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const res = await testHelper.commonUserGetRequest(student, `/users/${student._id}`);
      res.status.should.be.equal(200);
    });
    */

    it('should deny access to unit progress for an unauthorized user', async () => {
      const unit = await FixtureUtils.getRandomUnit();
      const course = await FixtureUtils.getCourseFromUnit(unit);
      const unauthorizedUser = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const res = await testHelper.commonUserGetRequest(unauthorizedUser, `/units/${unit._id}`);
      res.status.should.be.equal(403);
    });

    // The corresponding route has been disabled since it appears to be unused and insufficiently secured.
    /*
    it('should deny access to course progress for an unauthorized user', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const unauthorizedUser = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const res = await testHelper.commonUserGetRequest(unauthorizedUser, `/courses/${course._id}`);
      res.status.should.be.equal(403);
    });
    */

    it.only('should only return own unit progress for a student', async () => {
      const {unit, course, student} = await prepareSetup(true);
      // Currently the FixtureLoader will enrol at least 2 students per course, so this should never fail.
      const student2 = await User.findOne({_id: course.students[1] });
      await Promise.all([postProgressTestData(unit, student), postProgressTestData(unit, student2)]);

      const res = await testHelper.commonUserGetRequest(student, `/units/${unit._id}`);
      res.status.should.be.equal(200);
      res.body.should.not.be.empty;
      const studentId = student._id.toString();
      res.body.forEach((progress: any) => progress.user.should.equal(studentId));
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should create progress for some progressable unit', async () => {
      const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let a = test;',
        done: true,
        type: 'codeKata'
      };

      const res = await testHelper.commonUserPostRequest(student, '', newProgress);
      res.status.should.be.equal(200);
      res.body.course.should.be.equal(newProgress.course);
      res.body.unit.should.be.equal(newProgress.unit);
      res.body.user.should.be.equal(newProgress.user);
      res.body.done.should.be.equal(newProgress.done);
      res.body._id.should.be.a('string');
    });

    it('should create progress for some progressable unit with a deadline', async () => {
      const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      unit.deadline = moment().add(1, 'hour').format();
      await unit.save();

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let a = test',
        done: true,
        type: 'codeKata'
      };

      const res = await testHelper.commonUserPostRequest(student, '', newProgress);
      res.status.should.be.equal(200);
      res.body.course.should.be.equal(newProgress.course);
      res.body.unit.should.be.equal(newProgress.unit);
      res.body.user.should.be.equal(newProgress.user);
      res.body.done.should.be.equal(newProgress.done);
      res.body._id.should.be.a('string');
    });

    it('should fail creating progress for some progressable unit with a deadline', async () => {
      const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      unit.deadline = moment().subtract(1, 'hour').format();
      await unit.save();

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let a = test',
        done: true,
        type: 'codeKata'
      };

      const res = await testHelper.commonUserPostRequest(student, '', newProgress);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Past deadline, no further update possible');
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it('should update progress for some progressable unit', async () => {
      const unit = await Unit.findOne({progressable: true, __t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      const oldProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let b = test',
        done: false,
        type: 'codeKata'
      };

      const progress = await Progress.create(oldProgress);

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let a = test',
        done: true,
        type: 'codeKata'
      };

      const res = await testHelper.commonUserPutRequest(student, `/${progress._id.toString()}`, newProgress);
      res.status.should.be.equal(200);
      res.body.course.should.be.equal(newProgress.course);
      res.body.unit.should.be.equal(newProgress.unit);
      res.body.user.should.be.equal(newProgress.user);
      res.body.done.should.be.equal(newProgress.done);
      res.body._id.should.be.equal(progress._id.toString());
    });

    it('should update progress for some progressable unit with a deadline', async () => {
      const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      unit.deadline = moment().add(1, 'hour').format();
      await unit.save();

      const oldProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let b = test',
        done: false,
        type: 'codeKata'
      };

      const progress = await Progress.create(oldProgress);

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let a = test',
        done: true,
        type: 'codeKata'
      };

      const res = await testHelper.commonUserPutRequest(student, `/${progress._id.toString()}`, newProgress);
      res.status.should.be.equal(200);
      res.body.course.should.be.equal(newProgress.course);
      res.body.unit.should.be.equal(newProgress.unit);
      res.body.user.should.be.equal(newProgress.user);
      res.body.done.should.be.equal(newProgress.done);
      res.body._id.should.be.equal(progress._id.toString());
    });

    it('should fail updating progress for some progressable unit with a deadline', async () => {
      const unit: ICodeKataModel = <ICodeKataModel>await Unit.findOne({progressable: true, __t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      unit.deadline = moment().subtract(1, 'hour').format();
      await unit.save();

      const oldProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let b = test',
        done: false,
        type: 'codeKata'
      };

      const progress = await Progress.create(oldProgress);

      const newProgress = {
        course: course._id.toString(),
        unit: unit._id.toString(),
        user: student._id.toString(),
        code: 'let a = test',
        done: true,
        type: 'codeKata'
      };

      const res = await testHelper.commonUserPutRequest(student, `/${progress._id.toString()}`, newProgress);
      res.status.should.be.equal(400);
      res.body.name.should.be.equal('BadRequestError');
      res.body.message.should.be.equal('Past deadline, no further update possible');
    });
  });
});
