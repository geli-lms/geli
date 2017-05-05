process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import * as mongoose from 'mongoose';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/user';
const fixtureLoader = new FixtureLoader();

describe('User', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());
  after(() => mongoose.disconnect());

  describe(`GET ${BASE_URL}`, () => {
    it('should return all users', (done) => {
      User.findOne({email: 'student@test.local'})
        .then((authUser) => {
          chai.request(app)
            .get(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(authUser)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(2);

              res.body.forEach((user: any) => {
                user._id.should.be.a('string');
              });

              done();
            });
        })
        .catch(done);
    });
  });
});
