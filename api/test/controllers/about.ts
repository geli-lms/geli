import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import * as chai from 'chai';
import * as fs from 'fs';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/about';
const fixtureLoader = new FixtureLoader();

describe('About', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}/dependencies`, async () => {
    it('should return a json', async () => {
      const result = await chai.request(app)
        .get(`${BASE_URL}/dependencies`)
        .catch((err) => err.response);

      result.status.should.be.equal(200);
    });

    it('should fail when license file does not exist', async () => {
      await fs.renameSync('nlf-licenses.json', 'nlf-licenses.json.tmp');

      const result = await chai.request(app)
        .get(`${BASE_URL}/dependencies`)
        .catch((err) => err.response);
      result.status.should.be.equal(500);

      await fs.renameSync('nlf-licenses.json.tmp', 'nlf-licenses.json');
    });
  });
});
