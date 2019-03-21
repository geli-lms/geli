import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../../TestHelper';
import {Server} from '../../../src/server';
import {User} from '../../../src/models/User';
import {Lecture} from '../../../src/models/Lecture';
import {Course} from '../../../src/models/Course';
import {FixtureUtils} from '../../../fixtures/FixtureUtils';
import {Unit} from '../../../src/models/units/Unit';
import {ICodeKataModel} from '../../../src/models/units/CodeKataUnit';

chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/units';
const testHelper = new TestHelper(BASE_URL);

describe(`CodeKataUnit ${BASE_URL}`, () => {
  const model = {
    _course: '',
    name: 'Search and Replace',
    description: '...',
    progressable: true,
    weight: 0,
    __t: 'code-kata',
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

  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should fail with wrong authorization', async () => {
      const res = await chai.request(app)
        .post(BASE_URL)
        .set('Authorization', 'JWT asdf')
        .catch(err => err.response);

      res.status.should.be.equal(401);
    });

    it('should fail with BadRequest (missing lectureId)', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const res = await testHelper.commonUserPostRequest(teacher, '', {model});
      res.status.should.be.equal(400);
    });

    it('should fail with BadRequest (missing model)', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await testHelper.commonUserPostRequest(courseAdmin, '', {lectureId: lecture._id});
      res.status.should.be.equal(400);
    });

    it('should create a new codeKataUnit', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const courseAdmin = await User.findOne({_id: course.courseAdmin});
      model._course = course._id;

      const res = await testHelper.commonUserPostRequest(courseAdmin, '', {lectureId: lecture._id, model});
      res.status.should.be.equal(200);
      res.body.name.should.equal(model.name);
      res.body.description.should.equal(model.description);
    });

    it('should create a new codeKataUnit (entire code in model.code)', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const courseAdmin = await User.findOne({_id: course.courseAdmin});
      model._course = course._id;
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

      const res = await testHelper.commonUserPostRequest(courseAdmin, '', {lectureId: lecture._id, model});
      res.status.should.be.equal(200);
      res.body.name.should.equal(model.name);
      res.body.description.should.equal(model.description);
      res.body.unitCreator.profile.lastName.should.equal(courseAdmin.profile.lastName);
      res.body.unitCreator.profile.firstName.should.equal(courseAdmin.profile.firstName);
    });
  });

  describe(`PUT ${BASE_URL}`, () => {
    it('should update a codeKata', async () => {
      const unit = await Unit.findOne({__t: 'code-kata'});
      const lecture = await Lecture.findOne({units: { $in: [ unit._id ] }});
      const course = await Course.findOne({lectures: { $in: [ lecture._id ] }});
      const courseAdmin = await User.findOne({_id: course.courseAdmin});
      (<ICodeKataModel>unit).test += '\n// Test if we can edit a Kata';

      const res = await testHelper.commonUserPutRequest(courseAdmin, `/${unit.id}`, unit.toObject());
      res.status.should.be.equal(200);
      res.body.test.should.string('// Test if we can edit a Kata');
    });
  });
});
