import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {User} from '../../src/models/User';

const BASE_URL = '/api/message';
const expect = TestHelper.commonChaiSetup().expect;
const testHelper = new TestHelper(BASE_URL);

async function testMissingRoom(urlPostfix = '') {
  const admin = await FixtureUtils.getRandomAdmin();

  const result = await testHelper.commonUserGetRequest(admin, urlPostfix);

  expect(result).to.have.status(400);
}

async function testSuccess(urlPostfix = '') {
  const {roomId} = await FixtureUtils.getSimpleChatRoomSetup();
  const admin = await FixtureUtils.getRandomAdmin();

  const result = await testHelper.commonUserGetRequest(admin, urlPostfix, {room: roomId});

  expect(result).to.have.status(200);
  expect(result).to.be.json;
  return result;
}

async function testAccessDenial(urlPostfix = '') {
  const {course, roomId} = await FixtureUtils.getSimpleChatRoomSetup();
  const student = await User.findOne({role: 'student', _id: {$nin: course.students}});

  const result = await testHelper.commonUserGetRequest(student, urlPostfix, {room: roomId});

  expect(result).to.have.status(403);
}

describe('Message', async () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
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
