import fs = require('fs');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../../fixtures/FixtureUtils';
import {Server} from '../../../src/server';
import {FixtureLoader} from '../../../fixtures/FixtureLoader';
import {JwtUtils} from '../../../src/security/JwtUtils';
import {User} from '../../../src/models/User';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/units/';
const fixtureLoader = new FixtureLoader();

describe('AssignmentUnit', () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`POST ${BASE_URL}`, () => {
    it('should add an assignment unit to a random course', () => {

    })
  });

  describe(`POST ${BASE_URL}/:id/assignment`, () => {
    it('should add an assignment to an unit', async () => {

    })
  });
});
