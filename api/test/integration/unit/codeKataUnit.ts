import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../../src/server';
import {FixtureLoader} from '../../../fixtures/FixtureLoader';
import {JwtUtils} from '../../../src/security/JwtUtils';
import {IUser} from '../../../../shared/models/IUser';
import {User} from '../../../src/models/User';
import {Lecture} from '../../../src/models/Lecture';
import {ILecture} from '../../../../shared/models/ILecture';
import {ICourse} from '../../../../shared/models/ICourse';
import {Course} from '../../../src/models/Course';
import {CodeKataUnit, ICodeKataModel} from '../../../src/models/units/CodeKataUnit';

chai.use(chaiHttp);
chai.should();
const app = new Server().app;
const BASE_URL = '/api/units';
const fixtureLoader = new FixtureLoader();

describe(`CodeKataUnit ${BASE_URL}`, () => {
  // Before each test we reset the database
  const model = {
    _course: '',
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
        .post(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .end((err, res) => {
          res.status.should.be.equal(401);
          done();
        });
    });

    it('should fail with BadRequest (missing lectureId)', (done) => {
      User.findOne({email: 'teacher1@test.local'})
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
      User.findOne({email: 'teacher1@test.local'})
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
      User.findOne({email: 'teacher1@test.local'})
        .then((user: IUser) => {
          Course.findOne({name: 'Introduction to web development'})
            .then((course: ICourse) => {
              model._course = course._id;
              Lecture.findOne({name: 'Coding Train'})
                .then((lecture: ILecture) => {
                  chai.request(app)
                    .post(BASE_URL)
                    .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
                    .send({lectureId: lecture._id, model: model})
                    .end((err, res) => {
                      res.status.should.be.equal(200);

                      res.body.name.should.equal(model.name);
                      res.body.description.should.equal(model.description);
                      done();
                    });
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('should create a new codeKataUnit (entire code in model.code)', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user: IUser) => {
          Course.findOne({name: 'Introduction to web development'})
            .then((course: ICourse) => {
              model._course = course._id;
              Lecture.findOne({name: 'Coding Train'})
                .then((lecture: ILecture) => {
                  // The unitForm posts a new Kata with the entire code in model.code
                  const areaSeperator = '//####################';
                  model.code =
                    model.definition
                    + '\n\n' + areaSeperator + '\n\n'
                    + model.code
                    + '\n\n' + areaSeperator + '\n\n'
                    + model.test;
                  model.definition = undefined;
                  model.test = undefined;
                  chai.request(app)
                    .post(BASE_URL)
                    .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
                    .send({lectureId: lecture._id, model: model})
                    .end((err, res) => {
                      res.status.should.be.equal(200);

                      res.body.name.should.equal(model.name);
                      res.body.description.should.equal(model.description);
                      done();
                    });
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('should update a codeKata', (done) => {
      User.findOne({email: 'admin@test.local'})
        .then((user: IUser) => {
          CodeKataUnit.findOne({name: 'Search and Replace'})
            .then((kata: ICodeKataModel) => {
              kata.test += '\n// Test if we can edit a Kata';
              chai.request(app)
                .put(BASE_URL + '/' + kata.id)
                .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
                .send(kata.toObject())
                .end((err, res) => {
                  res.status.should.be.equal(200);

                  res.body.test.should.string('// Test if we can edit a Kata');
                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });
  });
});
