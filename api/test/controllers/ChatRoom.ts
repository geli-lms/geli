import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {ICourseModel} from '../../src/models/Course';
import {ICourse} from '../../../shared/models/ICourse';
import {JwtUtils} from '../../src/security/JwtUtils';
import {MigrationHandler} from '../../src/migrations/MigrationHandler';
import {IChatRoom} from '../../../shared/models/IChatRoom';
import chai = require('chai');
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

const app = new Server().app;
const BASE_URL = '/api/chatRoom';
const fixtureLoader = new FixtureLoader();

function getRandomRoomFromCourse(course: ICourse): IChatRoom {
  return course.chatRooms[Math.floor(Math.random() * course.chatRooms.length)];
}

describe('ChatRoom', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    // load fixtures
    await fixtureLoader.load();
    // run migrations for chat feature
    await (new MigrationHandler()).up(['course_v2', 'unit_v2']);
  });

  describe(`GET ${BASE_URL} :id`, async () => {
    it('should fail when parameter room invalid', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const result = await chai.request(app)
        .get(BASE_URL + '/507f1f77bcf86cd799439011')
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(404);
    });

    it('should return chat room', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse() as ICourseModel;

      const room = getRandomRoomFromCourse(course);
      const roomId = room._id.toString();

      const result = await chai.request(app)
        .get(BASE_URL + '/' + roomId)
        .set('Authorization', `JWT ${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
      expect(result).to.be.json;
    });
  });
});
