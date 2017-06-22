process.env.NODE_ENV = 'test';

import fs = require('fs');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Lecture} from '../../src/models/Lecture';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/units/upload';
const fixtureLoader = new FixtureLoader();

describe('Unit', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`POST ${BASE_URL}`, () => {
    it('should upload a video and return the lecture', () => {
      return User.findOne({email: 'teacher@test.local'})
        .then((user) => {
          return Lecture.findOne({name: 'Lecture 1'})
            .then((lecture) => ({user, lecture}));
      }).then(({user, lecture}) =>
          chai.request(app)
            .post(BASE_URL)
            .field('name', 'Test Upload')
            .field('description', 'This is my test upload.')
            .field('lectureId', lecture._id.toString())
            .attach('file', fs.readFileSync('fixtures/binaryData/testvideo.mp4'), 'testvideo.mp4')
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`))
        .then((res) => {
          res.status.should.be.equal(200);
          res.body.name.should.be.equal('Lecture 1');
          res.body.description.should.be.equal('Description Lecture 1');
        });
    }).timeout(10000); // use higher timeout for upload to complete
  });
});
