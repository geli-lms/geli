import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
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
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should fail, no auth', async () => {

      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });

    it('should fail, no auth', async () => {

      const res = await chai.request(app)
        .post(BASE_URL + '/size/')
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });

    it('should fail, this course does not exists', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const sizePackage = <IDownload> {courseName: '12312312313213', lectures: [{lectureId: '232323', units: [{unitId: '12351531531'}]}]};

      const res = await chai.request(app)
        .post(BASE_URL + '/size/')
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(sizePackage)
        .catch(err => err.response);
      res.status.should.be.equal(403);
    });
  });
});
