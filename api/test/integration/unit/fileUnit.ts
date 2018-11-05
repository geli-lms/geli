import fs = require('fs');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../../fixtures/FixtureUtils';
import {Server} from '../../../src/server';
import {FixtureLoader} from '../../../fixtures/FixtureLoader';
import {JwtUtils} from '../../../src/security/JwtUtils';
import {User} from '../../../src/models/User';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/units';
const fixtureLoader = new FixtureLoader();

describe('FileUnit', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  // FIXME: Add working test!
  // describe(`POST ${BASE_URL}`, () => {
  //   it('should upload a video and return the created unit', async () => {
  //     const course = await FixtureUtils.getRandomCourse();
  //     const courseAdmin = await User.findOne({_id: course.courseAdmin});

  //     const data = {
  //       model: {
  //         _course: course._id.toString(),
  //         name: 'Test Upload',
  //         description: 'This is my test upload.'
  //       },
  //       lectureId: course.lectures[0].toString()
  //     };

  //     const res = await chai.request(app)
  //       .post(BASE_URL)
  //       .field('data', JSON.stringify(data))
  //       .attach('file', fs.readFileSync('fixtures/binaryData/testvideo.mp4'), 'testvideo.mp4')
  //       .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`);

  //     res.status.should.be.equal(200);
  //     res.body.name.should.be.equal('Test Upload');
  //     res.body.description.should.be.equal('This is my test upload.');
  //   });
  // });
});
