import {Server} from '../../src/server';
import {FixtureLoader} from '../../fixtures/FixtureLoader';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Directory} from '../../src/models/mediaManager/Directory';
import {File} from '../../src/models/mediaManager/File';
import * as fs from 'fs';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/media';
const fixtureLoader = new FixtureLoader();

describe('Media', async () => {
  // Before each test we reset the database
  beforeEach(async () => {
    await fixtureLoader.load();
  });

  describe(`GET ${BASE_URL}`, async () => {

  });

  describe(`PUT ${BASE_URL}`, async () => {
    it('should create a root directory', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const rootDirectory = new Directory({
        name: 'root'
      });

      const result = await chai.request(app)
        .put(`${BASE_URL}/directory`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(rootDirectory)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not create root' +
        ' -> ' + result.body.message);
      result.body.__v.should.equal(0);
      result.body.name.should.equal(rootDirectory.name);
      result.body.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(0);
      result.body.files.should.be.instanceOf(Array).and.lengthOf(0);
    });

    it('should create a sub directory', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const rootDirectory = await new Directory({
        name: 'root'
      }).save();

      const subDirectory = await new Directory({
        name: 'sub'
      });

      const result = await chai.request(app)
        .put(`${BASE_URL}/directory/${rootDirectory._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .send(subDirectory)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not create subdirectory' +
        ' -> ' + result.body.message);
      result.body.__v.should.equal(0);
      result.body.name.should.equal(subDirectory.name);
      result.body.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(0);
      result.body.files.should.be.instanceOf(Array)
        .and.lengthOf(0);

      const updatedRoot = (await Directory.findById(rootDirectory));
      updatedRoot.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(1)
        .and.contains(result.body._id);
    });

    it('should upload a file', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const rootDirectory = await new Directory({
        name: 'root'
      }).save();

      const testFileName = fs.readdirSync('./')[0];
      const testFile = fs.readFileSync(testFileName);

      const result = await chai.request(app)
        .put(`${BASE_URL}/file/${rootDirectory._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .attach('file', testFile, testFileName)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not upload file' +
        ' -> ' + result.body.message);
      result.body.__v.should.equal(0);
      should.exist(result.body._id);
      should.exist(result.body.mimeType);
      should.exist(result.body.size);
      should.exist(result.body.physicalPath);
      result.body.name.should.be.equal(testFileName);

      const updatedRoot = (await Directory.findById(rootDirectory));
      updatedRoot.files.should.be.instanceOf(Array)
        .and.have.lengthOf(1)
        .and.contains(result.body._id);
    });
  });

  describe(`DELETE ${BASE_URL}`, async () => {
    it('should delete a directory', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const rootDirectory = await new Directory({
        name: 'root'
      }).save();

      const result = await chai.request(app)
        .del(`${BASE_URL}/directory/${rootDirectory._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not delete directory' +
        ' -> ' + result.body.message);

      should.not.exist(await Directory.findById(rootDirectory));
      // TODO: test if subDirectories and files got deleted
    });

    it('should delete a file', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const file = await new File({
        name: 'root',
        physicalPath: 'test/a',
        size: 129
      }).save();

      const result = await chai.request(app)
        .del(`${BASE_URL}/file/${file._id}`)
        .set('Authorization', `JWT ${JwtUtils.generateToken(teacher)}`)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not delete file' +
        ' -> ' + result.body.message);

      should.not.exist(await File.findById(file));
      // TODO: test if the actual file got deleted
    });
  });
});
