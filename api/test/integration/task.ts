process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Task} from '../../src/models/Task';
import {User} from '../../src/models/User';

chai.use(chaiHttp);

const app = new Server().app;
const BASE_URL = '/api/tasks';
const fixtureLoader = new FixtureLoader();

describe('Task', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`GET ${BASE_URL}`, () => {
    it('should return all tasks', (done) => {
      User.findOne({email: 'student1@test.local'})
        .then((user) => {
          chai.request(app)
            .get(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);

              res.body.forEach((task2: any) => {
                chai.expect(task2.name).to.equal('Wer wird Bundeskanzler 2017?');
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
      it('should add a new task', (done) => {

        User.findOne({email: 'teacher@test.local'})
          .then((user) => {
            const testData = {
              courseId: '0',
              name: 'Welches Jahr ist aktuell?',
              answers: [{
                value: true,
                text: '2017'
              }, {
                value: false,
                text: '2018'
              }]
            };

            chai.request(app)
              .post(BASE_URL)
              .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
              .send(testData)
              .end((err, res) => {
                res.status.should.be.equal(200);

                res.body.name.should.equal(testData.name);

                done();
              });
          })
          .catch(done);
      });
    });
  });
