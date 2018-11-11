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
const BASE_URL = '/api/message';
const fixtureLoader = new FixtureLoader();

function getRandomRoomFromCourse(course: ICourse): IChatRoom {
  return course.chatRooms[Math.floor(Math.random() * course.chatRooms.length)];
}

describe('Message', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    // load fixtures
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, async () => {
    it('should fail when parameter room missing', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const result = await chai.request(app)
        .get(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(400);
    });

    it('should return messages for chat room', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse() as ICourseModel;

      const room = getRandomRoomFromCourse(course);
      const roomId = room._id.toString();

      const result = await chai.request(app)
        .get(BASE_URL)
        .query({room: roomId})
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
      expect(result).to.be.json;
      expect(result.body).to.be.an('array');
    });
  });

  describe(`GET ${BASE_URL}/count`, async () => {
    it('should fail when parameter room missing', async () => {
      const student = await FixtureUtils.getRandomStudent();

      const result = await chai.request(app)
        .get(BASE_URL)
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(400);
    });

    it('should return messages for chat room', async () => {
      const student = await FixtureUtils.getRandomStudent();
      const course = await FixtureUtils.getRandomCourse() as ICourseModel;

      const room = getRandomRoomFromCourse(course);
      const roomId = room._id.toString();

      const result = await chai.request(app)
        .get(BASE_URL + '/count')
        .query({room: roomId})
        .set('Cookie', `token=${JwtUtils.generateToken(student)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
      expect(result).to.be.json;
      expect(result.body).to.have.property('count');
    });
  });
});
