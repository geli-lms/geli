import {
  Authorized, UseBefore, Body, CurrentUser, Delete, Get, JsonController, NotFoundError, ForbiddenError, Param, Post, Put,
  UploadedFile
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Directory} from '../models/mediaManager/Directory';
import {File} from '../models/mediaManager/File';
import {Course} from '../models/Course';
import {IDirectory} from '../../../shared/models/mediaManager/IDirectory';
import {IFile} from '../../../shared/models/mediaManager/IFile';
import {IUser} from '../../../shared/models/IUser';
import {extractSingleMongoId} from '../utilities/ExtractMongoId';
import crypto = require('crypto');
import config from '../config/main';

const multer = require('multer');
const path = require('path');

const uploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, config.uploadFolder);
    },
    filename: (req: any, file: any, cb: any) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(err, err ? undefined : raw.toString('hex') + path.extname(file.originalname));
      });
    }
  }),
};

@JsonController('/media')
@UseBefore(passportJwtMiddleware)
export class MediaController {
  @Authorized(['student', 'teacher', 'admin'])
  @Get('/directory/:id')
  async getDirectory(@Param('id') directoryId: string, @CurrentUser() currentUser: IUser) {
    const directory = await Directory.findById(directoryId);
    await this.checkCoursePrivilegesFor(directory, currentUser, 'userCanViewCourse');
    return directory.toObject();
  }

  @Authorized(['student', 'teacher', 'admin'])
  @Get('/directory/:id/lazy')
  async getDirectoryLazy(@Param('id') directoryId: string, @CurrentUser() currentUser: IUser) {
    const directory = await Directory.findById(directoryId)
      .populate('subDirectories')
      .populate('files');
    await this.checkCoursePrivilegesFor(directory, currentUser, 'userCanViewCourse');
    return directory.toObject();
  }

  @Authorized(['student', 'teacher', 'admin'])
  @Get('/file/:id')
  async getFile(@Param('id') fileId: string, @CurrentUser() currentUser: IUser) {
    const file = await File.findById(fileId);
    await this.checkCoursePrivilegesFor(file, currentUser, 'userCanViewCourse');
    return file.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Post('/directory')
  async createRootDirectory(@Body() directory: IDirectory, @CurrentUser() currentUser: IUser) {
    await this.checkCoursePrivilegesFor(directory, currentUser, 'userCanEditCourse');
    const savedDirectory = await new Directory(directory).save();
    return savedDirectory.toObject();
  }
  @Authorized(['teacher', 'admin'])
  @Post('/directory/:parent')
  async createDirectory(@Param('parent') parentDirectoryId: string, @Body() directory: IDirectory, @CurrentUser() currentUser: IUser) {
    const parent = await Directory.findById(parentDirectoryId);
    await this.checkCoursePrivilegesFor(parent, currentUser, 'userCanEditCourse');
    directory._course = parent._course;
    const savedDirectory = await new Directory(directory).save();

    parent.subDirectories.push(savedDirectory);
    await parent.save();

    return savedDirectory.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Post('/file/:parent')
  async createFile(@Param('parent') parentDirectoryId: string,
                   @UploadedFile('file', {options: uploadOptions}) uploadedFile: any,
                   @CurrentUser() currentUser: IUser) {
    const parent = await Directory.findById(parentDirectoryId);
    await this.checkCoursePrivilegesFor(parent, currentUser, 'userCanEditCourse');
    const file: IFile = new File({
      _course: parent._course,
      name: uploadedFile.originalname,
      physicalPath: uploadedFile.path,
      link: uploadedFile.filename,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimetype,
    });
    const savedFile = await new File(file).save();

    parent.files.push(savedFile);
    await parent.save();

    return savedFile.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Put('/directory/:id')
  async updateDirectory(@Param('id') directoryId: string, @Body() updatedDirectory: IDirectory, @CurrentUser() currentUser: IUser) {
    const directory = await Directory.findById(directoryId);
    await this.checkCoursePrivilegesFor(directory, currentUser, 'userCanEditCourse');
    if (extractSingleMongoId(directory._course) !== extractSingleMongoId(updatedDirectory._course)) {
      await this.checkCoursePrivilegesFor(updatedDirectory, currentUser, 'userCanEditCourse');
    }
    directory.set(updatedDirectory);
    const savedDirectory = await directory.save();
    return savedDirectory.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Put('/file/:id')
  async updateFile(@Param('id') fileId: string, @Body() updatedFile: IFile, @CurrentUser() currentUser: IUser) {
    const file = await File.findById(fileId);
    await this.checkCoursePrivilegesFor(file, currentUser, 'userCanEditCourse');
    if (extractSingleMongoId(file._course) !== extractSingleMongoId(updatedFile._course)) {
      await this.checkCoursePrivilegesFor(updatedFile, currentUser, 'userCanEditCourse');
    }
    file.set(updatedFile);
    const savedFile = await file.save();
    return savedFile.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Delete('/directory/:id')
  async deleteDirectory(@Param('id') directoryId: string, @CurrentUser() currentUser: IUser) {
    const directoryToDelete = await Directory.findById(directoryId);
    if (!directoryToDelete) {
      throw new NotFoundError();
    }
    await this.checkCoursePrivilegesFor(directoryToDelete, currentUser, 'userCanEditCourse');
    await directoryToDelete.remove();

    return {success: true};
  }

  @Authorized(['teacher', 'admin'])
  @Delete('/file/:id')
  async deleteFile(@Param('id') fileId: string, @CurrentUser() currentUser: IUser) {
    const fileToDelete = await File.findById(fileId);
    if (!fileToDelete) {
      throw new NotFoundError();
    }
    await this.checkCoursePrivilegesFor(fileToDelete, currentUser, 'userCanEditCourse');
    await fileToDelete.remove();

    return {success: true};
  }

  private async checkCoursePrivilegesFor (
      directoryOrFile: IDirectory | IFile,
      currentUser: IUser,
      privilege: 'userCanViewCourse' | 'userCanEditCourse') {
    const course = await Course.findById(directoryOrFile._course);
    if (!course.checkPrivileges(currentUser)[privilege]) {
      throw new ForbiddenError();
    }
  }
}
