import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../../src/server';
import {FixtureLoader} from '../../../fixtures/FixtureLoader';



chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/users';
const fixtureLoader = new FixtureLoader();

describe('FreeTextUnit', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, () => {
    it('should return ???', async () => {
      // TODO
    });
  });
});
