import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/config';
const fixtureLoader = new FixtureLoader();

describe('Config', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}/public/foo`, () => {
    it('should fail (foo)', async () => {
      const res = await chai.request(app)
        .get(`${BASE_URL}/public/foo`)
        .catch(err => err.response);
      res.status.should.be.equal(401);
      res.body.name.should.be.equal('UnauthorizedError');
    });

    it('should pass (legalnotice)', async () => {
      const res = await chai.request(app)
        .get(`${BASE_URL}/public/legalnotice`)
        .catch(err => err.response);
      res.status.should.be.equal(200);
      res.body.name.should.be.equal('legalnotice');
    });
  });

  describe(`PUT ${BASE_URL}/legalnotice`, () => {
    it('should pass', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      const res = await chai.request(app)
        .put(`${BASE_URL}/legalnotice`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .send({data: '# Legalnotice'});
      res.status.should.be.equal(200);
    });
  });

  describe(`GET ${BASE_URL}/foo`, () => {
    it('should pass', async () => {
      const admin = await FixtureUtils.getRandomAdmin();

      await chai.request(app)
        .put(`${BASE_URL}/foo`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .send({data: 'bar'});

      const res = await chai.request(app)
        .get(`${BASE_URL}/foo`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(admin)}`)
        .catch(err => err.response);
      res.status.should.be.equal(200);
      res.body.value.should.be.equal('bar');
    });
  });
});

