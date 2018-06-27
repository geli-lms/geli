import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import {IDownload} from '../../../shared/models/IDownload';


chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/download';
const fixtureLoader = new FixtureLoader();

describe('DownloadFile', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, () => {
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
  });


  describe(`POST ${BASE_URL + '/pdf/single'}`, () => {
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
});
