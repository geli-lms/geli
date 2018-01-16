import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {WhitelistUser} from '../../src/models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {ICourse} from '../../../shared/models/ICourse';

const app = new Server().app;
const BASE_URL = '/api/whitelist';
const fixtureLoader = new FixtureLoader();

describe('Whitelist User', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

  describe(`GET ${BASE_URL}`, () => {
    it('should get a whitelist user', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const newWhitelistUser: IWhitelistUser = new WhitelistUser({
        firstName: 'Max',
        lastName: 'Mustermann',
        uid: '123456',
        courseId: course._id
      });
      const createdWhitelistUser = await WhitelistUser.create(newWhitelistUser);
      const res = await chai.request(app)
        .get(`${BASE_URL}/${createdWhitelistUser._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);
      res.status.should.be.equal(200);
      res.body.firstName.should.be.equal(newWhitelistUser.firstName);
      res.body.lastName.should.be.equal(newWhitelistUser.lastName);
      res.body.uid.should.be.equal(newWhitelistUser.uid);
    });

    it('should get amount of whitelist user', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const count = WhitelistUser.count({courseId: course._id});
      const res = await chai.request(app)
        .get(`${BASE_URL}/${course._id}/count`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);
      res.status.should.be.equal(200);
      res.body.should.be.equal(count);
    });

    it('should fail with wrong authorization', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const count = WhitelistUser.count({courseId: course._id});
      const res = await chai.request(app)
        .get(`${BASE_URL}/${course._id}/count`)
        .set('Authorization', `JWT awf`);
      res.status.should.be.equal(401);
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should create a new whitelist User', async () => {
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const whitelistUser: any = {
        firstName: 'Max',
        lastName: 'Mustermann',
        uid: '1236456',
        courseId: course._id
      };
      const teacher = await FixtureUtils.getRandomTeacher();
      const res = await chai.request(app)
        .post(`${BASE_URL}/`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);
      res.status.should.be.equal(200);
      res.body.firstName.should.be.equal(whitelistUser.firstName.toLowerCase());
      res.body.lastName.should.be.equal(whitelistUser.lastName.toLowerCase());
      res.body.uid.should.be.equal(whitelistUser.uid.toLowerCase());
    });

    it('should fail with wrong authorization', async () => {
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const whitelistUser: any = {
        firstName: 'Max',
        lastName: 'Mustermann',
        uid: '1236456',
        courseId: course._id
      };
      const res = await chai.request(app)
        .post(`${BASE_URL}/`)
        .set('Authorization', `JWT awf`)
        .send(whitelistUser);
      res.status.should.be.equal(401);
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it('should update a whitelist user', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const newWhitelistUser: IWhitelistUser = new WhitelistUser({
        firstName: 'Max',
        lastName: 'Mustermann',
        uid: '123456',
        courseId: course._id
      });
      const createdWhitelistUser = await WhitelistUser.create(newWhitelistUser);
      const res = await
        chai.request(app)
          .put(`${BASE_URL}/${createdWhitelistUser._id}`)
          .send(createdWhitelistUser)
          .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);
      res.status.should.be.equal(200);
      res.body.firstName.should.be.equal(newWhitelistUser.firstName);
      res.body.lastName.should.be.equal(newWhitelistUser.lastName);
      res.body.uid.should.be.equal(newWhitelistUser.uid);
    });

    it('should fail with wrong authorization', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const newWhitelistUser: IWhitelistUser = new WhitelistUser({
        firstName: 'Max',
        lastName: 'Mustermann',
        uid: '123456',
        courseId: course._id
      });
      const createdWhitelistUser = await WhitelistUser.create(newWhitelistUser);
      const res = await chai.request(app)
        .put(`${BASE_URL}/${createdWhitelistUser._id}`)
        .send(createdWhitelistUser)
        .set('Authorization', `JWT awf`);
      res.status.should.be.equal(401);
    });

    describe(`DELETE ${BASE_URL}`, () => {
      it('should delete a whitelist user', async () => {
        const teacher = await FixtureUtils.getRandomTeacher();
        const course: ICourse = await FixtureUtils.getRandomCourse();
        const newWhitelistUser: IWhitelistUser = new WhitelistUser({
          firstName: 'Max',
          lastName: 'Mustermann',
          uid: '123456',
          courseId: course._id
        });
        const createdWhitelistUser = await WhitelistUser.create(newWhitelistUser);
        const res = await chai.request(app)
          .del(`${BASE_URL}/${createdWhitelistUser._id}`)
          .send(createdWhitelistUser)
          .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`);
        res.status.should.be.equal(200);
      });

      it('should fail with wrong authorization', async () => {
        const teacher = await FixtureUtils.getRandomTeacher();
        const course: ICourse = await FixtureUtils.getRandomCourse();
            const newWhitelistUser: IWhitelistUser = new WhitelistUser({
              firstName: 'Max',
              lastName: 'Mustermann',
              uid: '123456',
              courseId: course._id
            });
       const createdWhitelistUser = await WhitelistUser.create(newWhitelistUser);
            const res = await chai.request(app)
                .del(`${BASE_URL}/${createdWhitelistUser._id}`)
                .send(createdWhitelistUser)
                .set('Authorization', `JWT awf`);
        res.status.should.be.equal(401);
      });
    });
  });
});
