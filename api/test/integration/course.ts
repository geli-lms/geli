import {ICourse} from '../../../shared/models/ICourse';

process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
import {set} from 'mongoose';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/courses';
const fixtureLoader = new FixtureLoader();

describe('Course', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`GET ${BASE_URL}`, () => {
    it('should return all active courses', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user) => {
          chai.request(app)
            .get(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(5);

              res.body.forEach((course: any) => {
                course._id.should.be.a('string');
                course.name.should.be.a('string');
                course.active.should.be.a('boolean');
                course.active.should.be.equal(true);
              });

              done();
            });
        })
        .catch(done);
    });

    it('should fail with wrong authorization', (done) => {
      chai.request(app)
        .get(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .end((err, res) => {
          res.status.should.be.equal(401);
          done();
        });
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should add a new course', (done) => {

      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const testData = {
            name: 'Test Course',
            description: 'Test description'
          };

          chai.request(app)
            .post(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(testData)
            .end((err, res) => {
              res.status.should.be.equal(200);

              res.body.name.should.equal(testData.name);
              res.body.description.should.equal(testData.description);

              done();
            });
        })
        .catch(done);
    });
  });
});
