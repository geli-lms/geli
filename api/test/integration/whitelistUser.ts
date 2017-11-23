import * as chai from 'chai';
import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import {JwtUtils} from '../../src/security/JwtUtils';
import {User} from '../../src/models/User';
import {IUser} from '../../../shared/models/IUser';
import chaiHttp = require('chai-http');
import fs = require('fs');

chai.use(chaiHttp);
const app = new Server().app;
const BASE_URL = '/api/whitelist';
const fixtureLoader = new FixtureLoader();

describe('Whitelist User', () => {
  // Before each test we reset the database
  beforeEach(() => fixtureLoader.load());

});
