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
const BASE_URL = '/api/import';
const fixtureLoader = new FixtureLoader();

describe('Import', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}`, async () => {
    it('should import units', async () => {
      const coursesDirectory = 'build/fixtures/courses/';
      const coursefixtures = fs.readdirSync(coursesDirectory);

      let units: Array<IUnit> = [];
      for (const courseFilePath of coursefixtures) {
        const courseFile = fs.readFileSync(coursesDirectory + courseFilePath);
        const course: ICourse = JSON.parse(courseFile.toString());

        for (const lecture of course.lectures) {
          units = units.concat(lecture.units);
        }
      }

      for (const unit of units) {
        const tmpUnitFile = await createTempFile('unit');
        util.promisify(fs.write)(tmpUnitFile.fd, JSON.stringify(unit));

        const course = await FixtureUtils.getRandomCourse();
        const lecture = await FixtureUtils.getRandomLectureFromCourse(course);
        const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

        let unitJson: IUnit;
        const importResult = await chai.request(app)
          .post(`${BASE_URL}/unit/${course._id}/${lecture._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
          .attach('file', fs.readFileSync(tmpUnitFile.path), unit.name)
          .catch((err) => err.response);
        importResult.status.should.be.equal(200,
          'failed to import ' + unit.name +
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
            const freeTextUnit = <IFreeTextUnitModel>unit;
            (<IFreeTextUnit>unitJson).markdown.should.be.equal(freeTextUnit.markdown);
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
            process.stderr.write('import for "' + unit.type + '" is not completly tested');
            break;
        }
      }
    });

    it('should import lectures', async () => {
      const coursesDirectory = 'build/fixtures/courses/';
      const coursefixtures = fs.readdirSync(coursesDirectory);

      let lectures: Array<ILecture> = [];
      for (const courseFilePath of coursefixtures) {
        const courseFile = fs.readFileSync(coursesDirectory + courseFilePath);
        const course: ICourse = JSON.parse(courseFile.toString());

        lectures = lectures.concat(course.lectures);
      }

      for (const lecture of lectures) {
        const tmpLectureFile = await createTempFile('lecture');
        util.promisify(fs.write)(tmpLectureFile.fd, JSON.stringify(lecture));

        const course = await FixtureUtils.getRandomCourse();
        const teacher = await FixtureUtils.getRandomTeacherForCourse(course);

        let lectureJson: ILecture;
        const importResult = await chai.request(app)
          .post(`${BASE_URL}/lecture/${course._id}`)
          .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
          .attach('file', fs.readFileSync(tmpLectureFile.path), lecture.name)
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

    it('should import courses', async () => {
      const coursesDirectory = 'build/fixtures/courses/';
      const coursefixtures = fs.readdirSync(coursesDirectory);

      for (const courseFilePath of coursefixtures) {
        const teacher = await FixtureUtils.getRandomTeacher();
        const courseFile = fs.readFileSync(coursesDirectory + courseFilePath);
        const course: ICourse = JSON.parse(courseFile.toString());

        let courseJson: ICourse;
        const importResult = await chai.request(app)
          .post(`${BASE_URL}/course`)
          .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
          .attach('file', courseFile, courseFilePath)
          .catch((err) => err.response);
        importResult.status.should.be.equal(200,
          'failed to import ' + course.name +
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
  });
});
