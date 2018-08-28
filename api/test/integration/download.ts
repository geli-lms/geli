import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import {IDownload} from '../../../shared/models/IDownload';
import {IUser} from '../../../shared/models/IUser';
import {Lecture} from '../../src/models/Lecture';

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

const app = new Server().app;
const BASE_URL = '/api/download';
const fixtureLoader = new FixtureLoader();

describe('DownloadFile', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  after(async () => {
    await requestValidCleanup();
  });

  async function postValidRequest() {
    const unit = await FixtureUtils.getRandomUnit();
    const lecture = await FixtureUtils.getLectureFromUnit(unit);
    const course = await FixtureUtils.getCoursesFromLecture(lecture);
    const courseAdmin = await User.findById(course.courseAdmin);
    const downloadRequestData: IDownload = {
      courseName: course._id,
      lectures: [{ lectureId: lecture._id, units: [{ unitId: unit._id }] }]
    };

    const res = await chai.request(app)
      .post(BASE_URL  + '/pdf/single')
      .set('Authorization', `JWT ${JwtUtils.generateToken(courseAdmin)}`)
      .send(downloadRequestData)
      .catch(err => err.response);
    res.status.should.be.equal(200);
    return { postRes: res, courseAdmin };
  }

  function requestCleanup(user: IUser) {
    return chai.request(app)
      .del(BASE_URL + '/cache')
      .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
      .catch(err => err.response);
  }

  async function requestValidCleanup() {
    const admin = await FixtureUtils.getRandomAdmin();
    const res = await requestCleanup(admin);
    res.status.should.be.equal(200);
  }

  describe(`GET ${BASE_URL}`, () => {
    it('should succeed for some valid input with prior POST', async () => {
      const { postRes, courseAdmin } = await postValidRequest();
      postRes.body.should.not.be.empty;

      const res = await chai.request(app)
        .get(BASE_URL + '/' + postRes.body)
        .set('Authorization', `JWT ${JwtUtils.generateToken(courseAdmin)}`)
        .catch(err => err.response);
      res.status.should.be.equal(200);
    });

    it('should fail, malignant file id', async () => {
      const { postRes, courseAdmin } = await postValidRequest();
      postRes.body.should.not.be.empty;

      const res = await chai.request(app)
        .get(BASE_URL + '/%2E%2E%2F' + postRes.body)
        .set('Authorization', `JWT ${JwtUtils.generateToken(courseAdmin)}`)
        .catch(err => err.response);
      res.status.should.be.equal(403);
    });

    it('should fail, no auth', async () => {

      const res = await chai.request(app)
        .get(BASE_URL + '/123456789')
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });

    it('should fail, no hash with that id', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const res = await chai.request(app)
        .get(BASE_URL + '/123456789')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .catch(err => err.response);
      res.status.should.be.equal(404);
    });
  });

    describe(`POST ${BASE_URL + '/pdf/individual'}`, () => {
    it('should fail, no auth', async () => {
      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/individual')
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });
    it('should fail, course does not exists', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await User.findById(course.courseAdmin);
      const testData: IDownload = {
        courseName: '000000000000000000000000',
        'lectures': [{
          'lectureId': '000000000000000000000000',
          'units': [{'unitId': '000000000000000000000000'}]
        }]
      };
      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/individual')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(testData)
        .catch(err => err.response);
      res.status.should.be.equal(404);
    });
    it('should fail, because user is not in course', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await User.findById(course.courseAdmin);
      const user = await User.findOne().where('_id').ne(teacher._id);
      const testData: IDownload = {
        courseName: course._id,
        'lectures': [{
          'lectureId': '000000000000000000000000',
          'units': [{'unitId': '000000000000000000000000'}]
        }]
      };
      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/individual')
        .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
        .send(testData)
        .catch(err => err.response);
      res.status.should.be.equal(404);
    });
    it('should fail, because the lectures is empty and the IDownloadObject cant be created', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await User.findById(course.courseAdmin);
      const testData = {
        courseName: course._id,
        'lectures': Array
      };
      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/individual')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(testData)
        .catch(err => err.response);
      res.status.should.be.equal(500);
    });
    it('should pass', async () => {
      const course = await FixtureUtils.getRandomCourseWithAllUnitTypes();
      const teacher = await User.findById(course.courseAdmin);
      const lectures: any[] = [];
      for (const lec of course.lectures) {
        const lecture = await Lecture.findById(lec);
        const units: any[]  = [];
        for ( const unitId of lecture.units) {
          const temp: any = {};
          temp['unitId'] = unitId;
          units.push(temp);
        }
        const tempLec: any = {};
        tempLec['lectureId'] = lec;
        tempLec['units'] = units;
        lectures.push(tempLec);
      }
      const testData = {
        'courseName': course._id,
        'lectures': lectures
      };
      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/individual')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(testData)
        .catch(err => err.response);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    }).timeout(30000);
  });

  describe(`POST ${BASE_URL + '/pdf/single'}`, () => {
    it('should succeed for some valid input', async () => {
      await postValidRequest();
    });

    it('should fail, no auth', async () => {

      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/single')
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });

    it('should fail, course does not exists', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await User.findById(course.courseAdmin);

      const testData: IDownload = {
        courseName: '000000000000000000000000',
        'lectures': [{
          'lectureId': '000000000000000000000000',
          'units': [{'unitId': '000000000000000000000000'}]
        }]
      };

      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/single')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(testData)
        .catch(err => err.response);
      res.status.should.be.equal(404);
    });

    it('should fail, because user is not in course', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await User.findById(course.courseAdmin);
      const user = await User.findOne().where('_id').ne(teacher._id);

      const testData: IDownload = {
        courseName: course._id,
        'lectures': [{
          'lectureId': '000000000000000000000000',
          'units': [{'unitId': '000000000000000000000000'}]
        }]
      };

      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/single')
        .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
        .send(testData)
        .catch(err => err.response);
      res.status.should.be.equal(404);
    });

    it('should fail, because the lectures is empty and the IDownloadObject cant be created', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const teacher = await User.findById(course.courseAdmin);

      const testData = {
        courseName: course._id,
        'lectures': Array
      };

      const res = await chai.request(app)
        .post(BASE_URL + '/pdf/single')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(testData)
        .catch(err => err.response);
      res.status.should.be.equal(500);
    });
  });

  describe(`DELETE ${BASE_URL}/cache`, () => {
    it('should succeed with admin as user', async () => {
      await requestValidCleanup();
    });

    it('should fail with non-admin as user', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const res = await requestCleanup(student);
      res.status.should.be.equal(403);
    });
  });
});

