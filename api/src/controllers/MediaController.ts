import {
  Authorized, UseBefore, Body, Delete, Get, JsonController, NotFoundError, Param, Post, Put,
  UploadedFile
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {Directory} from '../models/mediaManager/Directory';
import {File} from '../models/mediaManager/File';
import {IDirectory} from '../../../shared/models/mediaManager/IDirectory';
import {IFile} from '../../../shared/models/mediaManager/IFile';
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
  async getDirectory(@Param('id') directoryId: string) {
    const directory = await Directory.findById(directoryId);
    return directory.toObject();
  }

  @Authorized(['student', 'teacher', 'admin'])
  @Get('/directory/:id/lazy')
  async getDirectoryLazy(@Param('id') directoryId: string) {
    const directory = await Directory.findById(directoryId)
      .populate('subDirectories')
      .populate('files');
    return directory.toObject();
  }

  @Authorized(['student', 'teacher', 'admin'])
  @Get('/file/:id')
  async getFile(@Param('id') fileId: string) {
    const file = await File.findById(fileId);
    return file.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Post('/directory')
  async createRootDirectory(@Body() directory: IDirectory) {
    const savedDirectory = await new Directory(directory).save();
    return savedDirectory.toObject();
  }
  @Authorized(['teacher', 'admin'])
  @Post('/directory/:parent')
  async createDirectory(@Param('parent') parentDirectoryId: string, @Body() directory: IDirectory) {
    const savedDirectory = await new Directory(directory).save();

    const parent = await Directory.findById(parentDirectoryId);
    parent.subDirectories.push(savedDirectory);
    await parent.save();

    return savedDirectory.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Post('/file/:parent')
  async createFile(@Param('parent') parentDirectoryId: string, @UploadedFile('file', {options: uploadOptions}) uploadedFile: any) {
    const file: IFile = new File({
      name: uploadedFile.originalname,
      physicalPath: uploadedFile.path,
      link: uploadedFile.filename,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimetype,
    });
    const savedFile = await new File(file).save();

    const parent = await Directory.findById(parentDirectoryId);
    parent.files.push(savedFile);
    await parent.save();

    return savedFile.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Put('/directory/:id')
  async updateDirectory(@Param('id') directoryId: string, @Body() updatedDirectory: IDirectory) {
    const directory = await Directory.findById(directoryId);
    directory.set(updatedDirectory);
    const savedDirectory = await directory.save();
    return savedDirectory.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Put('/file/:id')
  async updateFile(@Param('id') fileId: string, @Body() updatedFile: IFile) {
    const file = await File.findById(fileId);
    file.set(updatedFile);
    const savedFile = await file.save();
    return savedFile.toObject();
  }

  @Authorized(['teacher', 'admin'])
  @Delete('/directory/:id')
  async deleteDirectory(@Param('id') directoryId: string) {
    const directoryToDelete = await Directory.findById(directoryId);
    if (!directoryToDelete) {
      throw new NotFoundError();
    }
    await directoryToDelete.remove();

    return {success: true};
  }

  @Authorized(['teacher', 'admin'])
  @Delete('/file/:id')
  async deleteFile(@Param('id') fileId: string) {
    const fileToDelete = await File.findById(fileId);
    if (!fileToDelete) {
      throw new NotFoundError();
    }
    await fileToDelete.remove();

    return {success: true};
  }
}
