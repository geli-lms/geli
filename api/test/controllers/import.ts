import * as chai from 'chai';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {Course} from '../../src/models/Course';
import {ICourse} from '../../../shared/models/ICourse';
import {User} from '../../src/models/User';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Lecture} from '../../src/models/Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {IUnit} from '../../../shared/models/units/IUnit';
import {Unit} from '../../src/models/units/Unit';
import {IFreeTextUnit} from '../../../shared/models/units/IFreeTextUnit';
import {IFreeTextUnitModel} from '../../src/models/units/FreeTextUnit';
import {ICodeKataModel} from '../../src/models/units/CodeKataUnit';
import {ICodeKataUnit} from '../../../shared/models/units/ICodeKataUnit';
import {ITaskUnitModel} from '../../src/models/units/TaskUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import * as fs from 'fs';
import {ObjectID} from 'bson';

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
        const teacher = await FixtureUtils.getRandomTeacher();
        const courseFile = fs.readFileSync(coursesDirectory + courseFilePath);
        const course: ICourse = JSON.parse(courseFile.toString());

        for (const lecture of course.lectures) {
          units = units.concat(lecture.units);
        }
      }
    });

    it('should import lectures', async () => {
      const coursesDirectory = 'build/fixtures/courses/';
      const coursefixtures = fs.readdirSync(coursesDirectory);

      let lectures: Array<ILecture> = [];
      for (const courseFilePath of coursefixtures) {
        const teacher = await FixtureUtils.getRandomTeacher();
        const courseFile = fs.readFileSync(coursesDirectory + courseFilePath);
        const course: ICourse = JSON.parse(courseFile.toString());

        lectures = lectures.concat(course.lectures);
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
          .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
          .attach('file', courseFile, courseFilePath)
          .catch((err) => err.response);
        importResult.status.should.be.equal(200, 'failed to import ' + course.name + ' -> ' + importResult.body.message);
        courseJson = importResult.body;
        should.exist(importResult.body.createdAt);
        should.exist(importResult.body.__v);
        should.exist(importResult.body.updatedAt);
        should.exist(courseJson._id);
        courseJson.courseAdmin.should.be.equal(teacher.id);
        courseJson.name.startsWith(course.name).should.be.equal(true);
        courseJson.description.should.be.equal(course.description);
        courseJson.lectures.should.be.instanceOf(Array).and.have.lengthOf(course.lectures.length);
      }
    });
  });
});
