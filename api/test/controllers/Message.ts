import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {User} from '../../src/models/User';
import {IUser} from '../../../shared/models/IUser';
import {JwtUtils} from '../../src/security/JwtUtils';
import chai = require('chai');
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

const app = new Server().app;
const BASE_URL = '/api/message';
const fixtureLoader = new FixtureLoader();

async function commonRequest(user: IUser, urlPostfix = '', queryOptions?: string | object) {
  return await chai.request(app)
    .get(BASE_URL + urlPostfix)
    .query(queryOptions)
    .set('Cookie', `token=${JwtUtils.generateToken(user)}`)
    .catch((err) => err.response);
}

async function testMissingRoom(urlPostfix = '') {
  const admin = await FixtureUtils.getRandomAdmin();

  const result = await commonRequest(admin, urlPostfix);

  expect(result).to.have.status(400);
}

async function testSuccess(urlPostfix = '') {
  const {roomId} = await FixtureUtils.getSimpleChatRoomSetup();
  const admin = await FixtureUtils.getRandomAdmin();

  const result = await commonRequest(admin, urlPostfix, {room: roomId});

  expect(result).to.have.status(200);
  expect(result).to.be.json;
  return result;
}

async function testAccessDenial(urlPostfix = '') {
  const {course, roomId} = await FixtureUtils.getSimpleChatRoomSetup();
  const student = await User.findOne({role: 'student', _id: {$nin: course.students}});

  const result = await commonRequest(student, urlPostfix, {room: roomId});

  expect(result).to.have.status(403);
}

describe('Message', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    // load fixtures
    await fixtureLoader.load();
  });

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
