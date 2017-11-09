import fs = require('fs');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/units/upload';
const fixtureLoader = new FixtureLoader();

describe('Unit', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`POST ${BASE_URL}`, () => {
    it('should upload a video and return the created unit', (done) => {
      User.findOne({email: 'teacher1@test.local'})
      .then((user) => {
        return Course.findOne({name: 'Introduction to web development'})
        .then((course) => ({user, course}));
      })
      .then(({user, course}) => {
        chai.request(app)
        .post(`${BASE_URL}/video`)
        .field('name', 'Test Upload')
        .field('description', 'This is my test upload.')
        .field('lectureId', course.lectures[0].toString())
        .field('courseId', course._id.toString())
        .attach('file', fs.readFileSync('fixtures/binaryData/testvideo.mp4'), 'testvideo.mp4')
        .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
        .end((err, res) => {
          res.status.should.be.equal(200);
          res.body.name.should.be.equal('Test Upload');
          res.body.description.should.be.equal('This is my test upload.');

          done();
        });
      })
      .catch(done);
    }).timeout(10000);
  });
});
