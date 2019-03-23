import {Server} from '../../src/server';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {TestHelper} from '../TestHelper';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import {JwtUtils} from '../../src/security/JwtUtils';
import {Directory} from '../../src/models/mediaManager/Directory';
import {File} from '../../src/models/mediaManager/File';
import config from '../../src/config/main';
import * as fs from 'fs';

chai.use(chaiHttp);
const should = chai.should();
const app = new Server().app;
const BASE_URL = '/api/media';
const testHelper = new TestHelper(BASE_URL);

/**
 * Common unit test setup helper function.
 */
async function commonSetup () {
  const course = await FixtureUtils.getRandomCourse();
  const teacher = await FixtureUtils.getRandomTeacherForCourse(course);
  return {course, teacher};
}

describe('Media', async () => {
  beforeEach(() => testHelper.resetForNextTest());

  describe(`GET ${BASE_URL}`, async () => {
    async function commonGetSetup (withDirectories = true) {
      const {course, teacher} = await commonSetup();

      const file = await new File({
        _course: course._id.toString(),
        name: 'root',
        link: 'test/a',
        size: 129
      }).save();
      const subDirectory = withDirectories && await new Directory({
        _course: course._id.toString(),
        name: 'sub'
      }).save();
      const rootDirectory = withDirectories && await new Directory({
        _course: course._id.toString(),
        name: 'root',
        subDirectories: [subDirectory],
        files: [file]
      }).save();

      return {course, teacher, file, subDirectory, rootDirectory};
    }

    it('should get a directory', async () => {
      const {teacher, file, subDirectory, rootDirectory} = await commonGetSetup(true);

      const result = await testHelper.commonUserGetRequest(teacher, `/directory/${rootDirectory.id}`);
      result.status.should.be.equal(200,
        'could not get directory' +
        ' -> ' + result.body.message);
      result.body.name.should.equal(rootDirectory.name);
      result.body.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(1)
        .and.contains(subDirectory.id);
      result.body.files.should.be.instanceOf(Array)
        .and.have.lengthOf(1)
        .and.contains(file.id);
    });

    it('should fail to get a directory for an unauthorized user', async () => {
      const {course, rootDirectory} = await commonGetSetup(true);
      const unauthorizedUser = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const result = await testHelper.commonUserGetRequest(unauthorizedUser, `/directory/${rootDirectory.id}`);
      result.status.should.be.equal(403);
    });

    it('should get a populated directory', async () => {
      const {teacher, file, subDirectory, rootDirectory} = await commonGetSetup(true);

      const result = await testHelper.commonUserGetRequest(teacher, `/directory/${rootDirectory.id}/lazy`);
      result.status.should.be.equal(200,
        'could not get directory' +
        ' -> ' + result.body.message);
      result.body._id.should.be.equal(rootDirectory.id);
      result.body.name.should.equal(rootDirectory.name);
      result.body.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(1);
      result.body.subDirectories[0]._id.should.be.equal(subDirectory.id);
      result.body.subDirectories[0].name.should.be.equal(subDirectory.name);
      result.body.subDirectories[0].subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(subDirectory.subDirectories.length);
      result.body.subDirectories[0].files.should.be.instanceOf(Array)
        .and.have.lengthOf(subDirectory.files.length);
      result.body.files.should.be.instanceOf(Array)
        .and.have.lengthOf(1);
      result.body.files[0]._id.should.be.equal(file.id);
      result.body.files[0].name.should.be.equal(file.name);
      result.body.files[0].size.should.be.equal(file.size);
      result.body.files[0].link.should.be.equal(file.link);
    });

    it('should fail to get a populated directory for an unauthorized user', async () => {
      const {course, rootDirectory} = await commonGetSetup(true);
      const unauthorizedUser = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const result = await testHelper.commonUserGetRequest(unauthorizedUser, `/directory/${rootDirectory.id}/lazy`);
      result.status.should.be.equal(403);
    });

    it('should get a file', async () => {
      const {teacher, file} = await commonGetSetup(false);

      const result = await testHelper.commonUserGetRequest(teacher, `/file/${file.id}`);
      result.status.should.be.equal(200,
        'could not get file' +
        ' -> ' + result.body.message);
      result.body._id.should.be.equal(file.id);
      result.body.name.should.be.equal(file.name);
      result.body.size.should.be.equal(file.size);
      result.body.link.should.be.equal(file.link);
    });

    it('should fail to get a file for an unauthorized user', async () => {
      const {course, file} = await commonGetSetup(false);
      const unauthorizedUser = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const result = await testHelper.commonUserGetRequest(unauthorizedUser, `/file/${file.id}`);
      result.status.should.be.equal(403);
    });
  });

  describe(`POST ${BASE_URL}`, async () => {
    async function commonPostSetup () {
      const {course, teacher} = await commonSetup();

      const subDirectory = await new Directory({
        name: 'sub'
      });
      const rootDirectory = new Directory({
        _course: course._id.toString(),
        name: 'root'
      });

      return {course, teacher, subDirectory, rootDirectory};
    }

    it('should create a root directory', async () => {
      const {teacher, rootDirectory} = await commonPostSetup();

      const result = await testHelper.commonUserPostRequest(teacher, '/directory', rootDirectory);
      result.status.should.be.equal(200,
        'could not create root' +
        ' -> ' + result.body.message);
      result.body.__v.should.equal(0);
      result.body.name.should.equal(rootDirectory.name);
      result.body.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(0);
      result.body.files.should.be.instanceOf(Array).and.lengthOf(0);
    });

    it('should fail to create a root directory for an unauthorized teacher', async () => {
      const {course, rootDirectory} = await commonPostSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const result = await testHelper.commonUserPostRequest(unauthorizedTeacher, '/directory', rootDirectory);
      result.status.should.be.equal(403);
    });

    it('should create a sub directory', async () => {
      const {teacher, rootDirectory, subDirectory} = await commonPostSetup();
      await rootDirectory.save();

      const result = await testHelper.commonUserPostRequest(teacher, `/directory/${rootDirectory._id}`, subDirectory);
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

    it('should fail to create a sub directory for an unauthorized teacher', async () => {
      const {course, rootDirectory, subDirectory} = await commonPostSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);
      await rootDirectory.save();

      const result = await testHelper.commonUserPostRequest(unauthorizedTeacher, `/directory/${rootDirectory._id}`, subDirectory);
      result.status.should.be.equal(403);
    });

    it('should upload a file', async () => {
      const {teacher, rootDirectory} = await commonPostSetup();
      await rootDirectory.save();

      const testFileName = 'test_file.txt';
      const testFile = fs.readFileSync('./test/resources/' + testFileName);

      const result = await chai.request(app)
        .post(`${BASE_URL}/file/${rootDirectory._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .attach('file', testFile, testFileName)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not upload file' +
        ' -> ' + result.body.message);
      result.body.__v.should.equal(0);
      should.exist(result.body._id);
      should.exist(result.body.mimeType);
      should.exist(result.body.size);
      should.exist(result.body.link);
      result.body.name.should.be.equal(testFileName);

      const updatedRoot = (await Directory.findById(rootDirectory));
      updatedRoot.files.should.be.instanceOf(Array)
        .and.have.lengthOf(1)
        .and.contains(result.body._id);
    });


    it('should upload a file without extension', async () => {
      const {teacher, rootDirectory} = await commonPostSetup();
      await rootDirectory.save();

      const testFileName = 'test_file_without_extension';
      const testFile = fs.readFileSync('./test/resources/' + testFileName);

      const result = await chai.request(app)
        .post(`${BASE_URL}/file/${rootDirectory._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(teacher)}`)
        .attach('file', testFile, testFileName)
        .catch((err) => err.response);

      result.status.should.be.equal(200,
        'could not upload file' +
        ' -> ' + result.body.message);
      result.body.__v.should.equal(0);
      should.exist(result.body._id);
      should.exist(result.body.mimeType);
      should.exist(result.body.size);
      should.exist(result.body.link);
      result.body.name.should.be.equal(testFileName);

      const updatedRoot = (await Directory.findById(rootDirectory));
      updatedRoot.files.should.be.instanceOf(Array)
        .and.have.lengthOf(1)
        .and.contains(result.body._id);
    });

    it('should fail to upload a file for an unauthorized teacher', async () => {
      const {course, rootDirectory} = await commonPostSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);
      await rootDirectory.save();

      const testFileName = 'test_file.txt';
      const testFile = fs.readFileSync('./test/resources/' + testFileName);

      const result = await chai.request(app)
        .post(`${BASE_URL}/file/${rootDirectory._id}`)
        .set('Cookie', `token=${JwtUtils.generateToken(unauthorizedTeacher)}`)
        .attach('file', testFile, testFileName)
        .catch((err) => err.response);

      result.status.should.be.equal(403);
    });
  });

  describe(`PUT ${BASE_URL}`, async () => {
    async function commonPutSetup () {
      const {course, teacher} = await commonSetup();

      const file = new File({
        _course: course._id.toString(),
        name: 'file',
        link: 'test/a',
        size: 129
      });
      const subDirectory = await new Directory({
        _course: course._id.toString(),
        name: 'sub'
      });
      const rootDirectory = new Directory({
        _course: course._id.toString(),
        name: 'root'
      });

      return {course, teacher, file, subDirectory, rootDirectory};
    }

    it('should rename a directory', async () => {
      const {teacher, rootDirectory} = await commonPutSetup();
      await rootDirectory.save();

      const renamedDirectory = rootDirectory;
      renamedDirectory.name = 'renamedRoot';

      const result = await testHelper.commonUserPutRequest(teacher, `/directory/${rootDirectory._id}`, renamedDirectory);
      result.status.should.be.equal(200,
        'could not rename directory' +
        ' -> ' + result.body.message);
      result.body._id.should.equal(rootDirectory.id);
      result.body.name.should.equal(renamedDirectory.name);
      result.body.subDirectories.should.be.instanceOf(Array)
        .and.have.lengthOf(rootDirectory.subDirectories.length);
      result.body.files.should.be.instanceOf(Array)
        .and.lengthOf(rootDirectory.files.length);
    });

    it('should fail to update a directory for an unauthorized teacher', async () => {
      const {course, rootDirectory} = await commonPutSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);
      await rootDirectory.save();

      const renamedDirectory = rootDirectory;
      renamedDirectory.name = 'renamedRoot';

      const result = await testHelper.commonUserPutRequest(unauthorizedTeacher, `/directory/${rootDirectory._id}`, renamedDirectory);
      result.status.should.be.equal(403);
    });

    it('should rename a file', async () => {
      const {teacher, file} = await commonPutSetup();
      await file.save();

      const renamedFile = file;
      file.name = 'renamedFile';

      const result = await testHelper.commonUserPutRequest(teacher, `/file/${file._id}`, renamedFile);
      result.status.should.be.equal(200,
        'could not rename file' +
        ' -> ' + result.body.message);
      result.body._id.should.equal(file.id);
      result.body.name.should.equal(renamedFile.name);
      result.body.link.should.equal(file.link);
      result.body.size.should.equal(file.size);
    });

    it('should fail to update a file for an unauthorized teacher', async () => {
      const {course, file} = await commonPutSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);
      await file.save();

      const renamedFile = file;
      file.name = 'renamedFile';

      const result = await testHelper.commonUserPutRequest(unauthorizedTeacher, `/file/${file._id}`, renamedFile);
      result.status.should.be.equal(403);
    });
  });

  describe(`DELETE ${BASE_URL}`, async () => {
    async function commonDeleteSetup () {
      const {course, teacher} = await commonSetup();

      const subDirectory = await new Directory({
        _course: course._id.toString(),
        name: 'sub'
      }).save();
      const rootDirectory = await new Directory({
        _course: course._id.toString(),
        name: 'root',
        subDirectories: [subDirectory],
      }).save();

      return {course, teacher, subDirectory, rootDirectory};
    }

    async function commonDeleteFileSetup (withRootDirectory = true) {
      const {course, teacher} = await commonSetup();

      const testFileName = fs.readdirSync('./')[0];
      const testFile = fs.readFileSync(testFileName);
      fs.copyFileSync(testFileName, config.uploadFolder + '/test.file');

      const file = await new File({
        _course: course._id.toString(),
        name: 'root',
        physicalPath: config.uploadFolder + '/test.file',
        link: testFileName,
        size: testFile.length
      }).save();
      const rootDirectory = withRootDirectory && await new Directory({
        _course: course._id.toString(),
        name: 'root',
        files: [file]
      }).save();

      return {course, teacher, file, rootDirectory};
    }

    it('should delete a directory', async () => {
      const {teacher, rootDirectory} = await commonDeleteSetup();

      const result = await testHelper.commonUserDeleteRequest(teacher, `/directory/${rootDirectory._id}`);
      result.status.should.be.equal(200,
        'could not delete directory' +
        ' -> ' + result.body.message);
      should.not.exist(await Directory.findById(rootDirectory));
    });

    it('should delete a directory and its subdirectories', async () => {
      const {teacher, subDirectory, rootDirectory} = await commonDeleteSetup();

      const result = await testHelper.commonUserDeleteRequest(teacher, `/directory/${rootDirectory._id}`);
      result.status.should.be.equal(200,
        'could not delete directory' +
        ' -> ' + result.body.message);
      should.not.exist(await Directory.findById(rootDirectory));
      should.not.exist(await Directory.findById(subDirectory));
    });


    it('should delete a directory and its files', async () => {
      const {teacher, file, rootDirectory} = await commonDeleteFileSetup(true);

      const result = await testHelper.commonUserDeleteRequest(teacher, `/directory/${rootDirectory._id}`);
      result.status.should.be.equal(200,
        'could not delete directory' +
        ' -> ' + result.body.message);
      should.not.exist(await Directory.findById(rootDirectory));
      should.not.exist(await File.findById(file));
    });

    it('should delete a file', async () => {
      const {teacher, file} = await commonDeleteFileSetup(false);

      const result = await testHelper.commonUserDeleteRequest(teacher, `/file/${file._id}`);
      result.status.should.be.equal(200,
        'could not delete file' +
        ' -> ' + result.body.message);
      should.not.exist(await File.findById(file));
      fs.existsSync(config.uploadFolder + '/test.file').should.be.equal(false);
    });

    it('should fail to delete a directory for an unauthorized teacher', async () => {
      const {course, rootDirectory} = await commonDeleteSetup();
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const result = await testHelper.commonUserDeleteRequest(unauthorizedTeacher, `/directory/${rootDirectory._id}`);
      result.status.should.be.equal(403);
    });

    it('should fail to delete a file for an unauthorized teacher', async () => {
      const {course, file} = await commonDeleteFileSetup(false);
      const unauthorizedTeacher = await FixtureUtils.getUnauthorizedTeacherForCourse(course);

      const result = await testHelper.commonUserDeleteRequest(unauthorizedTeacher, `/file/${file._id}`);
      result.status.should.be.equal(403);
    });

    it('should fail when directory not found', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const result = await testHelper.commonUserDeleteRequest(teacher, '/directory/507f1f77bcf86cd799439011');
      result.status.should.be.equal(404);
    });

    it('should fail when file not found', async () => {
      const teacher = await FixtureUtils.getRandomTeacher();

      const result = await testHelper.commonUserDeleteRequest(teacher, '/file/507f1f77bcf86cd799439011');
      result.status.should.be.equal(404);
    });
  });
});
