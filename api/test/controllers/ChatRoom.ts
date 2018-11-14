import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {Server} from '../../src/server';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import chai = require('chai');
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

const app = new Server().app;
const BASE_URL = '/api/chatRoom';
const fixtureLoader = new FixtureLoader();

describe('ChatRoom', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    // load fixtures
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL} :id`, async () => {
    it('should fail when parameter room invalid', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const result = await chai.request(app)
        .get(BASE_URL + '/507f1f77bcf86cd799439011')
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(404);
    });

    it('should return chat room', async () => {
      const {roomId} = await FixtureUtils.getSimpleChatRoomSetup();
      const admin = await FixtureUtils.getRandomAdmin();

      const result = await chai.request(app)
        .get(BASE_URL + '/' + roomId)
        .set('Cookie', `token=${JwtUtils.generateToken(admin)}`)
        .catch((err) => err.response);

      expect(result).to.have.status(200);
      expect(result).to.be.json;
    });
  });
});
