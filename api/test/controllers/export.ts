import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
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

import {API_NOTIFICATION_TYPE_ALL_CHANGES, NotificationSettings} from '../../src/models/NotificationSettings';
import {Notification} from '../../src/models/Notification';
import {WhitelistUser} from '../../src/models/WhitelistUser';

import chai = require('chai');
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

const app = new Server().app;
const BASE_URL = '/api/export';
const fixtureLoader = new FixtureLoader();

describe('Export', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, async () => {
    it('should export units', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const units = await Unit.find();
      for (const unit of units) {
        let unitJson: IUnit;
        const exportResult = await chai.request(app)
          .get(`${BASE_URL}/unit/${unit._id}`)
          .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
          .catch((err) => err.response);
        exportResult.status.should.be.equal(200, 'failed to export ' + unit.name);
        unitJson = exportResult.body;
        should.not.exist(exportResult.body.createdAt);
        should.not.exist(exportResult.body.__v);
        should.not.exist(exportResult.body.updatedAt);
        should.not.exist(unitJson._id);
        // TODO: share this check since it is the same one as in import.ts
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

        // TODO: Do not use any cast
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
            process.stderr.write('export for "' + unit.type + '" is not completly tested');
            break;
        }
      }
    });

    it('should export lectures', async () => {
      const admin = await FixtureUtils.getRandomAdmin();
      const lectures = await Lecture.find();
      for (const lecture of lectures) {
        let lectureJson: ILecture;
        const exportResult = await chai.request(app)
          .get(`${BASE_URL}/lecture/${lecture._id}`)
          .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
          .catch((err) => err.response);
        exportResult.status.should.be.equal(200, 'failed to export ' + lecture.name);
        lectureJson = exportResult.body;
        should.not.exist(exportResult.body.createdAt);
        should.not.exist(exportResult.body.__v);
        should.not.exist(exportResult.body.updatedAt);
        should.not.exist(lectureJson._id);
        lectureJson.name.should.be.equal(lecture.name);
        lectureJson.description.should.be.equal(lecture.description);
        lectureJson.units.should.be.instanceOf(Array).and.have.lengthOf(lecture.units.length);
      }
    });

    it('should export courses', async () => {
      const courses = await Course.find();
      for (const course of courses) {
        const teacher = await User.findById(course.courseAdmin);

        let courseJson: ICourse;
        const exportResult = await chai.request(app)
          .get(`${BASE_URL}/course/${course._id}`)
          .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
          .catch((err) => err.response);
        exportResult.status.should.be.equal(200, 'failed to export ' + course.name);
        courseJson = exportResult.body;
        should.not.exist(exportResult.body.createdAt);
        should.not.exist(exportResult.body.__v);
        should.not.exist(exportResult.body.updatedAt);
        should.not.exist(courseJson._id);
        should.not.exist(courseJson.courseAdmin);
        should.not.exist(courseJson.teachers);
        should.not.exist(courseJson.students);
        should.not.exist(courseJson.whitelist);
        courseJson.name.should.be.equal(course.name);
        courseJson.description.should.be.equal(course.description);
        courseJson.lectures.should.be.instanceOf(Array).and.have.lengthOf(course.lectures.length);
      }
    });
  });

  describe(`GET ${BASE_URL}/user`, async () => {
    it('should export student data', async () => {
      const course1 = await FixtureUtils.getRandomCourse();
      const course2 = await FixtureUtils.getRandomCourse();
      const taskUnit = <ITaskUnitModel>await Unit.findOne({progressable: true, __t: 'task'});
      const lecture = await Lecture.findOne({units: { $in: [ taskUnit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const student = await User.findOne({_id: { $in: course.students}});

      await new NotificationSettings({
        'user': student, 'course': course1,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      await new NotificationSettings({
        'user': student, 'course': course2,
        'notificationType': API_NOTIFICATION_TYPE_ALL_CHANGES, 'emailNotification': false
      }).save();

      await new Notification({
        user: student,
        changedCourse: course1,
        text: 'blubba blubba'
      }).save();

      await new Notification({
        user: student,
        changedCourse: course2,
        text: 'blubba blubba'
      }).save();


      await new WhitelistUser({
        firstName: student.profile.firstName,
        lastName: student.profile.lastName,
        uid: student.uid,
        courseId: course1._id
      }).save();

      const result = await chai.request(app)
        .get(`${BASE_URL}/user`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
    });

    it('should export teacher data', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const result = await chai.request(app)
        .get(`${BASE_URL}/user`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
    });


    it('should export admin data', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const result = await chai.request(app)
        .get(`${BASE_URL}/user`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
    });
  });
});
