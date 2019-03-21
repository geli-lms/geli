import * as chai from 'chai';
import {Server} from '../../src/server';
import {TestHelper} from '../TestHelper';
import {User} from '../../src/models/User';
import {WhitelistUser} from '../../src/models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {ICourse} from '../../../shared/models/ICourse';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../../src/models/Course';

const app = new Server().app;
const BASE_URL = '/api/whitelist';
const testHelper = new TestHelper(BASE_URL);

describe('Whitelist User', () => {
  beforeEach(() => testHelper.resetForNextTest());

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
      const createdWhitelistUser: IWhitelistUser = await WhitelistUser.create(newWhitelistUser);
      const res = await testHelper.commonUserGetRequest(teacher, `/${createdWhitelistUser._id.toString()}`);
      res.status.should.be.equal(200);
      res.body.firstName.should.be.equal(newWhitelistUser.firstName);
      res.body.lastName.should.be.equal(newWhitelistUser.lastName);
      res.body.uid.should.be.equal(newWhitelistUser.uid);
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
      const res = await testHelper.commonUserPostRequest(teacher, '', whitelistUser);
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
        .set('Cookie', `token=awf`)
        .send(whitelistUser)
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });

    it('should add an user by synchronizing', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();
      const course: ICourse = await FixtureUtils.getRandomCourse();
      const user: IUser = await User.create(
        { uid: '1236456',
          password: 'test1234',
          email: 'test@ok.com',
          profile: {
          firstName: 'Max',
          lastName: 'Mustermann'
        }}
      );
      const whitelistUser: any = {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        uid: user.uid,
        courseId: course._id
      };
      const res = await testHelper.commonUserPostRequest(teacher, '', whitelistUser);
      res.status.should.be.equal(200);
      const resCourse = await Course.findById(course._id).populate('students');
      const addedUsers: IUser[] = resCourse.students.filter(stud => stud.uid === user.uid);
      addedUsers.length.should.be.not.eq(0);
      addedUsers[0].uid.should.be.eq(whitelistUser.uid);
      addedUsers[0].profile.firstName.should.be.eq(whitelistUser.firstName);
      addedUsers[0].profile.lastName.should.be.eq(whitelistUser.lastName);
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
      const res = await testHelper.commonUserPutRequest(teacher, `/${createdWhitelistUser._id}`, createdWhitelistUser);
      res.status.should.be.equal(200);
      res.body.firstName.should.be.equal(newWhitelistUser.firstName);
      res.body.lastName.should.be.equal(newWhitelistUser.lastName);
      res.body.uid.should.be.equal(newWhitelistUser.uid);
    });

    it('should fail with wrong authorization', async () => {
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
        .set('Cookie', `token=awf`)
        .catch(err => err.response);
      res.status.should.be.equal(401);
    });
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
        const res = await testHelper.commonUserDeleteRequest(teacher, `/${createdWhitelistUser._id}`);
        res.status.should.be.equal(200);
      });

      it('should fail with wrong authorization', async () => {
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
          .set('Cookie', `token=awf`)
          .catch(err => err.response);
        res.status.should.be.equal(401);
      });

      it('should delete an user by synchronizing', async () => {
        const teacher = await FixtureUtils.getRandomTeacher();
        const course: ICourse = await FixtureUtils.getRandomCourse();
        const member = course.students[0];
        const newWhitelistUser: IWhitelistUser = new WhitelistUser({
          firstName: member.profile.firstName,
          lastName: member.profile.lastName,
          uid: member.uid,
          courseId: course._id
        });
        const createdWhitelistUser = await WhitelistUser.create(newWhitelistUser);
        course.whitelist = course.whitelist.concat(createdWhitelistUser);
        await Course.findByIdAndUpdate(course._id, course);

        const res = await testHelper.commonUserDeleteRequest(teacher, `/${createdWhitelistUser._id}`);
        res.status.should.be.equal(200);
        const resCourse = await Course.findById(course._id).populate('students');
        const emptyUsers: IUser[] = resCourse.students.filter(stud => stud.uid === member.uid);
        emptyUsers.length.should.be.eq(0);
      });
    });
});
