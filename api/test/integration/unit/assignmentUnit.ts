import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Server} from '../../../src/server';
import {FixtureLoader} from '../../../fixtures/FixtureLoader';
import {JwtUtils} from '../../../src/security/JwtUtils';
import {User} from '../../../src/models/User';
import {Lecture} from '../../../src/models/Lecture';
import {Course} from '../../../src/models/Course';
import {FixtureUtils} from '../../../fixtures/FixtureUtils';
import {Unit} from '../../../src/models/units/Unit';
import {IAssignmentUnitModel} from '../../../src/models/units/AssignmentUnit';
import {IAssignment} from '../../../../shared/models/assignment/IAssignment';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/units';
const fixtureLoader = new FixtureLoader();

describe(`AssignmentUnit ${BASE_URL}`, () => {
  // Before each test we reset the database
  beforeEach(async() => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, () => {

    it('should get an assignment unit', async () => {
      const unit = await Unit.findOne({__t: 'assignment'});
      const lecture = await Lecture.findOne({units: {$in: [unit._id]}});
      const course = await Course.findOne({lectures: {$in: [lecture._id]}});

      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await chai.request(app)
        .get(BASE_URL + '/' + unit._id)
        .set('Cookie', `token=${JwtUtils.generateToken(courseAdmin)}`)
        .send({id: unit.id});

      res.status.should.be.equal(200);
    });
  });

  describe(`POST / DELETE / UPDATE ${BASE_URL}/:id/assignments`, () => {

    it('should create an assignment in an assignment unit', async () => {
      const unit = await Unit.findOne({__t: 'assignment'});
      const lecture = await Lecture.findOne({units: {$in: [unit._id]}});
      const course = await Course.findOne({lectures: {$in: [lecture._id]}});

      const courseStudent = await FixtureUtils.getRandomStudentForCourse(course);

      const res = await chai.request(app)
        .post(`${BASE_URL}/${unit._id}/assignment`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseStudent)}`)
        .send({id: unit.id});

      res.status.should.be.equal(200);
      res.body.user.should.be.equal(courseStudent._id.toString());
    });


    it('should update an assignment in an assignment unit', async () => {
      const unit = <IAssignmentUnitModel>await Unit.findOne({__t: 'assignment'});
      const lecture = await Lecture.findOne({units: {$in: [unit._id]}});
      const course = await Course.findOne({lectures: {$in: [lecture._id]}});

      const courseStudent = await FixtureUtils.getRandomStudentForCourse(course);

      const assignment: IAssignment = {
        _id: null,
        files: [],
        user: courseStudent._id,
        submitted: false,
        checked: -1,
        submittedDate: new Date()
      };

      unit.assignments.push(assignment);
      await unit.save();

      assignment.submitted = true;

      const res = await chai.request(app)
        .put(`${BASE_URL}/${unit._id}/assignment`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseStudent)}`)
        .send(assignment);

      res.status.should.be.equal(200);
    });

    it('should delete an assignment in an assignment unit', async () => {
      const unit = <IAssignmentUnitModel>await Unit.findOne({__t: 'assignment'});
      const lecture = await Lecture.findOne({units: {$in: [unit._id]}});
      const course = await Course.findOne({lectures: {$in: [lecture._id]}});


      const courseStudent = await FixtureUtils.getRandomStudentForCourse(course);

      const assignment: IAssignment = {
        _id: null,
        files: [],
        user: courseStudent._id,
        submitted: false,
        checked: -1,
        submittedDate: new Date()
      };

      unit.assignments.push(assignment);
      await unit.save();

      const res = await chai.request(app)
        .del(`${BASE_URL}/${unit._id}/assignment`)
        .set('Cookie', `token=${JwtUtils.generateToken(courseStudent)}`)
        .send(assignment);

      res.status.should.be.equal(200);

      const unitAfter =  <IAssignmentUnitModel>await Unit.findById(unit._id.toString());
      const hasBeenRemoved = unitAfter.assignments.length < unit.assignments.length;

      hasBeenRemoved.should.be.true;
    });
  });
});
