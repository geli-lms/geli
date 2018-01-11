import {Authorized, Body, Delete, Get, JsonController, Param, Put} from 'routing-controllers';
import {Directory} from '../models/mediaManager/Directory';
import {File} from '../models/mediaManager/File';
import {IDirectory} from '../../../shared/models/mediaManager/IDirectory';
import {IFile} from '../../../shared/models/mediaManager/IFile';

@JsonController('/media')
@Authorized()
export class MediaController {
  @Get('/directory/:id')
  async getDirectory(@Param('id') directoryId: string) {
    return Directory.findById(directoryId);
  }

  @Get('/directory/:id/lazy')
  async getDirectoryLazy(@Param('id') directoryId: string) {
    return Directory.findById(directoryId)
      .populate('subDirectories')
      .populate('files');
  }

  @Get('/file/:id')
  async getFile(@Param('id') fileId: string) {
    return File.findById(fileId);
  }

  @Put('/directory')
  async createRootDirectory(@Body() directory: IDirectory) {
    return new Directory(directory).save();
  }
  @Put('/directory/:parent')
  async createDirectory(@Param('parent') parentDirectoryId: string, @Body() directory: IDirectory) {
    const savedDirectory = await new Directory(directory).save();

    const parent = await Directory.findById(parentDirectoryId);
    parent.subDirectories.push(savedDirectory);
    await parent.save();

    return savedDirectory;
  }

  @Put('/file/:parent')
  async createFile(@Param('parent') parentDirectoryId: string, @Body() file: IFile) {
    const savedFile = await new File(file).save();

    const parent = await Directory.findById(parentDirectoryId);
    parent.files.push(savedFile);
    await parent.save();

    return savedFile;
  }

  @Delete('/directory/:id')
  async deleteDirectory(@Param('id') directoryId: string) {
    const directoryToDelete = await Directory.findById(directoryId);
    await directoryToDelete.remove();

    return {success: true};
  }

  @Delete('/file/:id')
  async deleteFile(@Param('id') fileId: string) {
    const fileToDelete = await File.findById(fileId);
    await fileToDelete.remove();

    return {success: true};
  }
}
