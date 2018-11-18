import * as chai from 'chai';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {ICourse} from '../../../shared/models/ICourse';
import {JwtUtils} from '../../src/security/JwtUtils';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import * as fs from 'fs';
import * as util from 'util';
import {Course} from '../../src/models/Course';
import {User} from '../../src/models/User';
import {ICodeKataModel} from '../../src/models/units/CodeKataUnit';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';
import {ITaskUnitModel} from '../../src/models/units/TaskUnit';
import {IFreeTextUnitModel} from '../../src/models/units/FreeTextUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';

// how can i do this in the usual import scheme as above?
// 'track()' needs to be chained to the require in order to be able to delete all created temporary files afterwards
// see also: https://github.com/bruce/node-temp
const temp = require('temp').track();
const createTempFile = util.promisify(temp.open);

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/duplicate';
const fixtureLoader = new FixtureLoader();

describe('Duplicate', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should duplicate units', async () => {
      const units = await FixtureUtils.getUnits();

      for (const unit of units) {
        const course = await FixtureUtils.getCourseFromUnit(unit);
        const lecture = await FixtureUtils.getLectureFromUnit(unit);
        const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

        let unitJson: IUnit;
        const importResult = await chai.request(app)
          .post(`${BASE_URL}/unit/${unit._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
          .send({courseId: course._id, lectureId: lecture._id})
          .catch((err) => err.response);
        importResult.status.should.be.equal(200,
          'failed to duplicate ' + unit.name +
          ' into ' + lecture.name +
          ' from ' + course.name +
          ' -> ' + importResult.body.message);
        unitJson = importResult.body;
        should.exist(importResult.body.createdAt);
        should.exist(importResult.body.__v);
        should.exist(importResult.body.updatedAt);
        should.exist(unitJson._id);
        // TODO: share this check since it is the same one as in export.ts
        unitJson.name.should.be.equal(unit.name);
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

        let lectureJson: ILecture;
        const importResult = await chai.request(app)
          .post(`${BASE_URL}/lecture/${lecture._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
          .send({courseId: course._id})
          .catch((err) => err.response);
        importResult.status.should.be.equal(200,
          'failed to import ' + lecture.name +
          ' into ' + course.name +
          ' -> ' + importResult.body.message);
        lectureJson = importResult.body;
        should.exist(importResult.body.createdAt);
        should.exist(importResult.body.__v);
        should.exist(importResult.body.updatedAt);
        should.exist(lectureJson._id);
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

        let courseJson: ICourse;
        const importResult = await chai.request(app)
          .post(`${BASE_URL}/course/${course._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
          .send({courseAdmin: teacher._id})
          .catch((err) => err.response);
        importResult.status.should.be.equal(200,
          'failed to duplicate ' + course.name +
          ' -> ' + importResult.body.message);
        courseJson = importResult.body;
        should.exist(importResult.body.createdAt);
        should.exist(importResult.body.__v);
        should.exist(importResult.body.updatedAt);
        should.exist(courseJson._id);
        courseJson.active.should.be.equal(false);
        courseJson.courseAdmin.should.be.equal(teacher._id.toString());
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
      const lecture = await FixtureUtils.getLectureFromUnit(unit);
      const course = await FixtureUtils.getCourseFromUnit(unit);
      const unauthorizedTeacher = await User.findOne({
        role: 'teacher',
        _id: {$nin: [course.courseAdmin, ...course.teachers]}
      });

      const result = await chai.request(app)
          .post(`${BASE_URL}/unit/${unit._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(unauthorizedTeacher)}`)
          .send({courseId: course._id, lectureId: lecture._id})
          .catch((err) => err.response);

      result.status.should.be.equal(403);
    });

    it('should forbid lecture duplication for an unauthorized teacher', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const unauthorizedTeacher = await User.findOne({
        role: 'teacher',
        _id: {$nin: [course.courseAdmin, ...course.teachers]}
      });

      const result = await chai.request(app)
          .post(`${BASE_URL}/lecture/${lecture._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(unauthorizedTeacher)}`)
          .send({courseId: course._id})
          .catch((err) => err.response);

      result.status.should.be.equal(403);
    });

    it('should forbid course duplication for an unauthorized teacher', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const unauthorizedTeacher = await User.findOne({
        role: 'teacher',
        _id: {$nin: [course.courseAdmin, ...course.teachers]}
      });

      const result = await chai.request(app)
          .post(`${BASE_URL}/course/${course._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(unauthorizedTeacher)}`)
          .send({courseAdmin: unauthorizedTeacher._id})
          .catch((err) => err.response);

      result.status.should.be.equal(403);
    });
  });
});
