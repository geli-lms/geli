process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../../src/server';
import {FixtureLoader} from '../../../fixtures/FixtureLoader';
import {JwtUtils} from '../../../src/security/JwtUtils';
import {IUser} from '../../../../shared/models/IUser';
import {User} from '../../../src/models/User';
import {Lecture} from '../../../src/models/Lecture';
import {ILecture} from '../../../../shared/models/ILecture';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/units/code-katas';
const fixtureLoader = new FixtureLoader();

describe(`CodeKataUnit ${BASE_URL}`, () => {
  // Before each test we reset the database
  const model = {
      name: 'Search and Replace',
      description: '...',
      progressable: true,
      weight: 0,
      type: 'code-kata',
      definition: '// Task: Manipulate the targetSet, so it only contains the values "Hello" and "h_da"' +
      '\n' +
      '\nlet targetSet = new Set(["Hello", "there"]);',
      code: 'targetSet.add("h_da");' +
      '\ntargetSet.delete("there");',
      test: 'validate();' +
      '\n' +
      '\nfunction validate() {' +
      '\n\treturn targetSet.has("Hello") && targetSet.has("h_da") && targetSet.size === 2;' +
      '\n' +
      '}'
  };
  beforeEach(() => fixtureLoader.load());

  describe(`POST ${BASE_URL}`, () => {
    it('should fail with wrong authorization', (done) => {
      chai.request(app)
        .get(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .end((err, res) => {
          res.status.should.be.equal(401);
          done();
        });
    });

    it('should fail with BadRequest (missing lectureId)', (done) => {
      User.findOne({email: 'teacher@test.local'})
        .then((user: IUser) => {
          chai.request(app)
            .post(BASE_URL)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send({model: model})
            .end((err, res) => {
              res.status.should.be.equal(400);

              done();
            });
        })
        .catch(done);
    });

    it('should fail with BadRequest (missing model)', (done) => {
      User.findOne({email: 'teacher@test.local'})
        .then((user: IUser) => {
          Lecture.findOne({name: 'Coding Train'})
            .then((lecture: ILecture) => {
              chai.request(app)
                .post(BASE_URL)
                .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
                .send({lectureId: lecture._id})
                .end((err, res) => {
                  res.status.should.be.equal(400);

                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });

    it('should create a new codeKataUnit', (done) => {
      User.findOne({email: 'teacher@test.local'})
        .then((user: IUser) => {
          Lecture.findOne({name: 'Coding Train'})
            .then((lecture: ILecture) => {
              chai.request(app)
                .post(BASE_URL)
                .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
                .send({lectureId: lecture._id, model: model})
                .end((err, res) => {
                  res.status.should.be.equal(200);

                  res.body.name.should.equal(lecture.name);
                  res.body.description.should.equal(lecture.description);
                  res.body.units.length.should.equal(lecture.units.length + 1);

                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });
  });
});
