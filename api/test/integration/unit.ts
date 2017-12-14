import fs = require('fs');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {FixtureUtils} from '../../fixtures/FixtureUtils';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/units/upload';
const fixtureLoader = new FixtureLoader();

describe('Unit', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should upload a video and return the created unit', async () => {
      const course = await FixtureUtils.getRandomCourse();
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .post(`${BASE_URL}/video`)
        .field('name', 'Test Upload')
        .field('description', 'This is my test upload.')
        .field('lectureId', course.lectures[0].toString())
        .field('courseId', course._id.toString())
        .attach('file', fs.readFileSync('fixtures/binaryData/testvideo.mp4'), 'testvideo.mp4')
        .set('Authorization', `JWT ${JwtUtils.generateToken(courseAdmin)}`);

      res.status.should.be.equal(200);
      res.body.name.should.be.equal('Test Upload');
      res.body.description.should.be.equal('This is my test upload.');
    });
  });
});
