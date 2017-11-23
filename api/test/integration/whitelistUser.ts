import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {IUser} from '../../../shared/models/IUser';
import chaiHttp = require('chai-http');
import fs = require('fs');
import {WhitelistUser} from '../../src/models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {whitelistUserFixtures} from '../../fixtures/WhitelistUserFixtures/whitelistUserFixtures';

chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/whitelist';
const fixtureLoader = new FixtureLoader();

describe('Whitelist User', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`GET ${BASE_URL}`, () => {
    it('should search for a whitelist user', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const newWhitelistUser: IWhitelistUser = new WhitelistUser({
            firstName: 'Max',
            lastName: 'Mustermann',
            uid: '123456'
          });
          WhitelistUser.create(newWhitelistUser).then((createdWhitelistUser) => {
            chai.request(app)
              .get(`${BASE_URL}/search`)
              .query({
                query: newWhitelistUser.uid +
                ' ' + newWhitelistUser.firstName +
                ' ' + newWhitelistUser.lastName
              })
              .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
              .end((err, res) => {
                res.status.should.be.equal(200);
                res.body.length.should.be.greaterThan(0);
                res.body[0].firstName.should.be.equal(newWhitelistUser.firstName);
                res.body[0].lastName.should.be.equal(newWhitelistUser.lastName);
                res.body[0].uid.should.be.equal(newWhitelistUser.uid);
                done();
              });
          });
        }).catch(done);
    });

    it('should fail with wrong authorization', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const newWhitelistUser: IWhitelistUser = new WhitelistUser({
            firstName: 'Max',
            lastName: 'Mustermann',
            uid: '123456'
          });
          WhitelistUser.create(newWhitelistUser).then((createdWhitelistUser) => {
            chai.request(app)
              .get(`${BASE_URL}/search`)
              .query({
                query: newWhitelistUser.uid +
                ' ' + newWhitelistUser.firstName +
                ' ' + newWhitelistUser.lastName
              })
              .set('Authorization', `JWT awf`)
              .end((err, res) => {
                res.status.should.be.equal(401);
                done();
              });
          });
        }).catch(done);
    });

    it('should get amount of whitelist user', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          WhitelistUser.count({}).then((count) => {
            chai.request(app)
              .get(`${BASE_URL}/count`)
              .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
              .end((err, res) => {
                res.status.should.be.equal(200);
                res.body.should.be.equal(count);
                done();
              });
          });
        }).catch(done);
    });

    it('should fail with wrong authorization', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          WhitelistUser.count({}).then((count) => {
            chai.request(app)
              .get(`${BASE_URL}/count`)
              .set('Authorization', `JWT awf`)
              .end((err, res) => {
                res.status.should.be.equal(401);
                done();
              });
          });
        }).catch(done);
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should create a new whitelist User', (done) => {
      const whitelistUser: any = {firstName: 'Max', lastName: 'Mustermann', uid: '1236456'};
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          chai.request(app)
            .post(`${BASE_URL}/`)
            .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
            .send(whitelistUser)
            .end((err, res) => {
              res.status.should.be.equal(200);
              res.body.firstName.should.be.equal(whitelistUser.firstName.toLowerCase());
              res.body.lastName.should.be.equal(whitelistUser.lastName.toLowerCase());
              res.body.uid.should.be.equal(whitelistUser.uid.toLowerCase());
              done();
            })
        })
    });

    it('should fail with wrong authorization', (done) => {
      const whitelistUser: any = {firstName: 'Max', lastName: 'Mustermann', uid: '1236456'};
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          chai.request(app)
            .post(`${BASE_URL}/`)
            .set('Authorization', `JWT awf`)
            .send(whitelistUser)
            .end((err, res) => {
              res.status.should.be.equal(401);
              done();
            })
        })
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it('should update a whitelist user', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const newWhitelistUser: IWhitelistUser = new WhitelistUser({
            firstName: 'Max',
            lastName: 'Mustermann',
            uid: '123456'
          });
          WhitelistUser.create(newWhitelistUser).then((createdWhitelistUser) => {
            chai.request(app)
              .put(`${BASE_URL}/${newWhitelistUser._id}`)
              .send(newWhitelistUser)
              .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
              .end((err, res) => {
                res.status.should.be.equal(200);
                res.body.firstName.should.be.equal(newWhitelistUser.firstName);
                res.body.lastName.should.be.equal(newWhitelistUser.lastName);
                res.body.uid.should.be.equal(newWhitelistUser.uid);
                done();
              });
          });
        }).catch(done);
    });

    it('should fail with wrong authorization', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const newWhitelistUser: IWhitelistUser = new WhitelistUser({
            firstName: 'Max',
            lastName: 'Mustermann',
            uid: '123456'
          });
          WhitelistUser.create(newWhitelistUser).then((createdWhitelistUser) => {
            chai.request(app)
              .put(`${BASE_URL}/${newWhitelistUser._id}`)
              .send(newWhitelistUser)
              .set('Authorization', `JWT awf`)
              .end((err, res) => {
                res.status.should.be.equal(401);
                done();
              });
          });
        }).catch(done);
    });
  });

  describe(`DELETE ${BASE_URL}`, () => {
    it('should delete a whitelist user', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const newWhitelistUser: IWhitelistUser = new WhitelistUser({
            firstName: 'Max',
            lastName: 'Mustermann',
            uid: '123456'
          });
          WhitelistUser.create(newWhitelistUser).then((createdWhitelistUser) => {
            chai.request(app)
              .del(`${BASE_URL}/${newWhitelistUser._id}`)
              .send(newWhitelistUser)
              .set('Authorization', `JWT ${JwtUtils.generateToken(user)}`)
              .end((err, res) => {
                res.status.should.be.equal(200);
                done();
              });
          });
        }).catch(done);
    });

    it('should fail with wrong authorization', (done) => {
      User.findOne({email: 'teacher1@test.local'})
        .then((user) => {
          const newWhitelistUser: IWhitelistUser = new WhitelistUser({
            firstName: 'Max',
            lastName: 'Mustermann',
            uid: '123456'
          });
          WhitelistUser.create(newWhitelistUser).then((createdWhitelistUser) => {
            chai.request(app)
              .del(`${BASE_URL}/${newWhitelistUser._id}`)
              .send(newWhitelistUser)
              .set('Authorization', `JWT awf`)
              .end((err, res) => {
                res.status.should.be.equal(401);
                done();
              });
          });
        }).catch(done);
    });
  })

});
