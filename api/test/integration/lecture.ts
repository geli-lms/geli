import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import {Lecture} from '../../src/models/Lecture';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/lecture';
const fixtureLoader = new FixtureLoader();

describe('Lecture', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`DELETE ${BASE_URL}` , () => {
    it('should delete a lecture by course admin', async () => {
      const course = await FixtureUtils.getRandomCourseWithAllUnitTypes();
      const lectureId = await course.lectures[0];
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .del(BASE_URL + '/' + lectureId)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`);

      res.status.should.be.equal(200);
      const courseWithDeletedLecture = await Course.findById(course._id);
      courseWithDeletedLecture.lectures[0].should.not.be.equal(lectureId);
      const deletedLecture = await Lecture.findById(lectureId);
      should.not.exist(deletedLecture, 'Lecture still exists');
    });
  });

});
