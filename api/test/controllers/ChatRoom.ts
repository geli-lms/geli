import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';

const BASE_URL = '/api/chatRoom';
const expect = TestHelper.commonChaiSetup().expect;
const testHelper = new TestHelper(BASE_URL);

describe('ChatRoom', async () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`GET ${BASE_URL} :id`, async () => {
    it('should fail when parameter room invalid', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const result = await testHelper.commonUserGetRequest(admin, '/507f1f77bcf86cd799439011');

      expect(result).to.have.status(404);
    });

    it('should return chat room', async () => {
      const {roomId} = await FixtureUtils.getSimpleChatRoomSetup();
      const admin = await FixtureUtils.getRandomAdmin();

      const result = await testHelper.commonUserGetRequest(admin, '/' + roomId);

      expect(result).to.have.status(200);
      expect(result).to.be.json;
    });
  });
});
