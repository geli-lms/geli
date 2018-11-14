import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {User} from '../../src/models/User';
import {ICourseModel} from '../../src/models/Course';
import {ICourse} from '../../../shared/models/ICourse';
import {IChatRoom} from '../../../shared/models/IChatRoom';
import {JwtUtils} from '../../src/security/JwtUtils';
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

  async function testMissingRoom(urlPostfix = '') {
    const admin = await FixtureUtils.getRandomAdmin();

    const result = await chai.request(app)
      .get(BASE_URL + urlPostfix)
      .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
      .catch((err) => err.response);

    expect(result).to.have.status(400);
  }

  async function testSuccess(urlPostfix = '') {
    const admin = await FixtureUtils.getRandomAdmin();
    const course = await FixtureUtils.getRandomCourse() as ICourseModel;

    const room = getRandomRoomFromCourse(course);
    const roomId = room._id.toString();

    const result = await chai.request(app)
      .get(BASE_URL + urlPostfix)
      .query({room: roomId})
      .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
      .catch((err) => err.response);

    expect(result).to.have.status(200);
    expect(result).to.be.json;
    return result;
  }

  async function testAccessDenial(urlPostfix = '') {
    const course = await FixtureUtils.getRandomCourse() as ICourseModel;
    const student = await User.findOne({role: 'student', _id: {$nin: course.students}});

    const room = getRandomRoomFromCourse(course);
    const roomId = room._id.toString();

    const result = await chai.request(app)
      .get(BASE_URL + urlPostfix)
      .query({room: roomId})
      .set('Cookie', `token=${JwtUtils.generateToken(student)}`)
      .catch((err) => err.response);

    expect(result).to.have.status(403);
  }

  describe(`GET ${BASE_URL}`, async () => {
    it('should fail when parameter room missing', async () => {
      await testMissingRoom();
    });

    it('should return messages for chat room', async () => {
      const result = await testSuccess();
      expect(result.body).to.be.an('array');
    });

    it('should deny access to chat room messages if unauthorized', async () => {
      await testAccessDenial();
    });
  });

  describe(`GET ${BASE_URL}/count`, async () => {
    it('should fail when parameter room missing', async () => {
      await testMissingRoom('/count');
    });

    it('should return message count for chat room', async () => {
      const result = await testSuccess('/count');
      expect(result.body).to.have.property('count');
    });

    it('should deny access to chat room message count if unauthorized', async () => {
      await testAccessDenial('/count');
    });
  });
});
