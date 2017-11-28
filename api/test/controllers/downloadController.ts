process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {User} from '../../src/models/User';
import {Lecture} from '../../src/models/Lecture';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Course} from '../../src/models/Course';
import * as moment from 'moment';


chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/download';
const fixtureLoader = new FixtureLoader();

describe('DownloadController', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`POST ${BASE_URL}`, () => {
    it('It should post a download object and get a link to a zip file', async () => {
      const user = await User.findOne({email: 'teacher1@test.local'});
      const course = await Course.findOne({name: 'Introduction to web development'});
      const lecture = await Lecture.findOne({name: 'Coding Train'});
      const downloadObject = {
        course: course.name,
        letcture: lecture.name,
        units: lecture.units
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
          .send(downloadObject)
          .end((err, res) => {
            if (err) {
              return reject(err);
            }

            res.status.should.be.equal(200);
            resolve();
          });
      });
    });

    it('It should fail: Authorization', async () => {
      const user = await User.findOne({email: 'teacher1@test.local'});
      const course = await Course.findOne({name: 'Introduction to web development'});
      const lecture = await Lecture.findOne({name: 'Coding Train'});
      const downloadObject = {
        course: course.name,
        letcture: lecture.name,
        units: lecture.units
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .send(downloadObject)
          .end((err, res) => {
            if (err) {
              res.status.should.be.equal(401);
              err.message.should.be.equal('Unauthorized');
              resolve();
            }
          });
      });
    });

    it('It should fail: wrong id', async () => {
      const user = await User.findOne({email: 'teacher1@test.local'});
      const course = await Course.findOne({name: 'Introduction to web development'});
      const lecture = await Lecture.findOne({name: 'Coding Train'});

      const downloadObject = {
        course: course.name,
        letcture: lecture.name,
        units: '000000000000000000000000'
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
          .send(downloadObject)
          .end((err, res) => {
            if (err) {
              res.status.should.be.equal(500);
              err.message.should.be.equal('Internal Server Error');
              resolve();
            }
          });
      });
    });

    it('It should fail: empty array', async () => {
      const user = await User.findOne({email: 'teacher1@test.local'});
      const course = await Course.findOne({name: 'Introduction to web development'});
      const lecture = await Lecture.findOne({name: 'Coding Train'});

      const downloadObject = {
        course: course.name,
        letcture: lecture.name,
        units: Array
      };

      return new Promise((resolve, reject) => {
        chai.request(app)
          .post(BASE_URL)
          .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
          .send(downloadObject)
          .end((err, res) => {
            if (err) {
              res.status.should.be.equal(500);
              err.message.should.be.equal('Internal Server Error');
              resolve();
            }
          });
      });
    });
  });
});
