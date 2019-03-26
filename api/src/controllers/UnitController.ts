import {
  Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError, BadRequestError, Post,
  Authorized, CurrentUser, UploadedFile, Res, UploadedFiles, InternalServerError, ForbiddenError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {errorCodes} from '../config/errorCodes';
import {Course} from '../models/Course';
import {Lecture} from '../models/Lecture';
import {IUnitModel, Unit, AssignmentUnit} from '../models/units/Unit';
import {IUser} from '../../../shared/models/IUser';
import {IAssignment} from '../../../shared/models/assignment/IAssignment';
import config from '../config/main';
import {File} from '../models/mediaManager/File';
import {IFile} from '../../../shared/models/mediaManager/IFile';
import {IAssignmentUnit} from '../../../shared/models/units/IAssignmentUnit';
import {IProgress} from '../../build/../../shared/models/progress/IProgress';
import {Progress} from '../models/progress/Progress';
import {IAssignmentUnitProgress} from '../../../shared/models/progress/IAssignmentProgress';
import {User} from '../models/User';

import crypto = require('crypto');
import {IAssignmentUnitModel} from '../models/units/AssignmentUnit';
import {promisify} from 'util';
import {Response} from 'express';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const cache = require('node-file-cache').create({life: config.timeToLiveCacheValue});

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


@JsonController('/units')
@UseBefore(passportJwtMiddleware)
export class UnitController {

  protected waitForArchiveToFinish(output: any, archive: any) {
    return new Promise((resolve, reject) => {
      output.on('close', () => {
        resolve();
      });

      archive.finalize();
    });
  }
  /**
   * @api {get} /api/units/:id Request unit
   * @apiName GetUnit
   * @apiGroup Unit
   *
   * @apiParam {String} id Unit ID.
   *
   * @apiSuccess {Unit} unit Unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2017-11-08T22:00:11.500Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "unitCreator": "5a037e6b60f72236d8e7c834",
   *         "type": "free-text",
   *         "__v": 0
   *     }
   *
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Get('/:id')
  async getUnit(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const unit = await this.getUnitFor(id, currentUser, 'userCanViewCourse');
    return unit.toObject();
  }

  /**
   * @api {post} /api/units/ Add unit
   * @apiName PostUnit
   * @apiGroup Unit
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {Object} data New unit data.
   *
   * @apiSuccess {Unit} unit Added unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2017-11-08T22:00:11.500Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "type": "free-text",
   *         "unitCreator": "5a037e6b60f72236d8e7c834",
   *         "__v": 0
   *     }
   *
   * @apiError BadRequestError Invalid combination of file upload and unit data.
   * @apiError BadRequestError No lecture ID was submitted.
   * @apiError BadRequestError No unit was submitted.
   * @apiError BadRequestError Unit has no _course set.
   * @apiError BadRequestError
   * @apiError ForbiddenError
   * @apiError ValidationError
   */
  @Authorized(['teacher', 'admin'])
  @Post('/')
  async addUnit(@Body() data: any, @CurrentUser() currentUser: IUser) {
    // discard invalid requests
    this.checkPostParam(data);

    const course = await Course.findById(data.model._course);
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }

    // Set current user as creator, old unit's dont have a creator
    data.model.unitCreator = currentUser._id;
    try {
      const createdUnit = await Unit.create(data.model);
      return await this.pushToLecture(data.lectureId, createdUnit);
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw err;
      } else {
        throw new BadRequestError(err);
      }
    }
  }

  /**
   * @api {put} /api/units/:id Update unit
   * @apiName PutUnit
   * @apiGroup Unit
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {String} id Unit ID.
   * @apiParam {Object} data New unit data.
   *
   * @apiSuccess {Unit} unit Updated unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2018-01-29T23:43:07.220Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "type": "free-text",
   *         "__v": 0
   *     }
   *
   * @apiError BadRequestError Invalid combination of file upload and unit data.
   * @apiError BadRequestError
   * @apiError NotFoundError
   * @apiError ForbiddenError
   * @apiError ValidationError
   */
  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  async updateUnit(@Param('id') id: string, @Body() data: any, @CurrentUser() currentUser: IUser) {
    const oldUnit = await this.getUnitFor(id, currentUser, 'userCanEditCourse');

    try {
      oldUnit.set(data);
      const updatedUnit: IUnitModel = await oldUnit.save();
      return updatedUnit.toObject();
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw err;
      } else {
        throw new BadRequestError(err);
      }
    }
  }

  /**
   * @api {delete} /api/units/:id Delete unit
   * @apiName DeleteUnit
   * @apiGroup Unit
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Unit ID.
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   *
   * @apiError NotFoundError
   * @apiError ForbiddenError
   */
  @Authorized(['teacher', 'admin'])
  @Delete('/:id')
  async deleteUnit(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const unit = await this.getUnitFor(id, currentUser, 'userCanEditCourse');

    await Lecture.updateMany({}, {$pull: {units: id}});
    await unit.remove();
    return {};
  }

  private async getUnitFor (unitId: string, currentUser: IUser, privilege: 'userCanViewCourse' | 'userCanEditCourse') {
    const unit = await Unit.findById(unitId).orFail(new NotFoundError());

    const course = await Course.findById(unit._course);
    if (!course.checkPrivileges(currentUser)[privilege]) {
      throw new ForbiddenError();
    }

    return unit;
  }

  /**
   * @api {post} /api/units/:id/assignment Add assignment
   * @apiName PostAssignment
   * @apiGroup Unit
   * @apiPermission student
   *
   * @apiSuccess {IAssignment} assignment.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2017-11-08T22:00:11.500Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "type": "free-text",
   *         "unitCreator": "5a037e6b60f72236d8e7c834",
   *         "__v": 0
   *     }
   *
   * @apiError BadRequestError No lecture ID was submitted.
   * @apiError BadRequestError No unit was submitted.
   * @apiError BadRequestError Unit has no _course set.
   * @apiError BadRequestError
   * @apiError ValidationError
   */
  @Authorized(['student'])
  @Post('/:id/assignment')
  async addAssignment(@Param('id') id: string,
                      @CurrentUser() currentUser: IUser) {

    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id).orFail(new NotFoundError());

    // TODO: check if user is in course.

    let assignment: IAssignment = assignmentUnit.assignments.find(submittedAssignment => {
      return submittedAssignment.user._id.toString() === currentUser._id;
    });

    if (!!assignment) {
      // The user has already created an assignment. We cannot create another one.
      throw new BadRequestError();
    }

    try {
      assignment = {
        _id: null,
        files: [],
        user: currentUser._id,
        submitted: false,
        checked: -1,
        submittedDate: new Date()
      };

      assignmentUnit.assignments.push(assignment);
      await assignmentUnit.save();

      return assignment;
    } catch (err) {
      throw new BadRequestError(err);
    }
  }


  /**
   * Is called when the user wants to add a file to the assignment.
   * The user can add as much file as she wants as long as the assignment is not finalized/submitted yet.
   *
   * @apiParam {String} unitId
   * @apiParam {Object} uploadedFile
   * @apiParam {IUser} currentUser
   *
   * @apiError NotFoundError The unit was not found or there isn't an assignment from the current user in the unit.
   */
  @Authorized(['student'])
  @Put('/:id/assignment/files')
  async addFileToAssignment(@Param('id') unitId: string,
                            @UploadedFile('file', {options: uploadOptions}) uploadedFile: any,
                            @CurrentUser() currentUser: IUser) {

    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(unitId)
      .orFail(new NotFoundError());

    const assignment = assignmentUnit.assignments.find(submittedAssignment => {
      return submittedAssignment.user._id.toString() === currentUser._id;
    });

    if (!assignment) {
      throw new NotFoundError();
    }

    // The user already submitted/finalized the assignment.
    if (assignment.submitted) {
      throw new BadRequestError();
    }

    const fileMetadata: IFile = new File({
      name: uploadedFile.originalname,
      physicalPath: uploadedFile.path,
      link: uploadedFile.filename,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimetype,
    });

    try {
      const file = await new File(fileMetadata).save();
      if (!assignment.files) {
        assignment.files = [];
      }

      assignment.files.push(file._id);
      await assignmentUnit.save();

      return file.toObject();
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }


  /**
   * @api {put} /api/units/:id/assignment Update assignment
   * @apiName PutUnit
   * @apiGroup Unit
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {String} id Unit ID.
   * @apiParam {Object} data New unit data.
   *
   * @apiSuccess {Unit} unit Updated unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2018-01-29T23:43:07.220Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "type": "free-text",
   *         "__v": 0
   *     }
   *
   * @apiError NotFoundError
   * @apiError BadRequestError Invalid combination of file upload and unit data.
   * @apiError BadRequestError
   * @apiError ValidationError
   */
  @Authorized(['teacher', 'admin', 'student'])
  @Put('/:id/assignment')
  async updateAssignment(@Param('id') id: string, @Body() data: IAssignment, @CurrentUser() currentUser: IUser) {

    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id).orFail(new NotFoundError());

    let assignment: IAssignment = null;

    // The current user updates an assignment of a student.
    if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
      if (!data.user._id) {
        throw new BadRequestError();
      }

      assignment = assignmentUnit.assignments.find(
        submittedAssignment => `${submittedAssignment.user}` === data.user._id
      );

      assignment.checked = data.checked;

    } else {
      // A student updates her own assignment.

      // We can just retrieve the assignment where the author is the current user, as an user can
      // only have one assignment.
      assignment = assignmentUnit.assignments.find(
        submittedAssignment => `${submittedAssignment.user}` === currentUser._id
      );

      if (!assignment.submitted) {
        // Update the submitted state of the assignment.
        assignment.submitted = data.submitted;
        assignment.submittedDate = new Date();
      }
    }

    try {
      await assignmentUnit.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw err;
      } else {
        throw new BadRequestError(err);
      }
    }
    return true;
  }

  /**
   * @api {delete} /api/units/:id/assignment Delete assignment
   * @apiName DeleteAssginment
   * @apiGroup Unit
   * @apiPermission student
   *
   * @apiParam {String} id Unit ID.
   *
   * @apiSuccess {Boolean} result Confirmation of deletion.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "result": true
   *     }
   *
   * @apiError NotFoundError
   */
  @Authorized(['student'])
  @Delete('/:id/assignment')
  async deleteAssignment(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id);


    if (!assignmentUnit) {
      throw new NotFoundError();
    }

    for (const assignment of assignmentUnit.assignments) {
      if (assignment.user._id.toString() === currentUser._id) {
        if (assignment.submitted) {
          throw new BadRequestError();
        }
        const index = assignmentUnit.assignments.indexOf(assignment, 0);
        assignmentUnit.assignments.splice(index, 1);
        await assignmentUnit.save();
        return true;
      }
    }

  }

  /**
   * @api {get} /api/units/:id/assignments/:assignment Request unit
   * @apiName GetUnit
   * @apiGroup Unit
   *
   * @apiParam {String} id Unit ID.
   * @apiParam {String} assignment Assignment id.
   *
   * @apiSuccess {Unit} unit Unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2017-11-08T22:00:11.500Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "unitCreator": "5a037e6b60f72236d8e7c834",
   *         "type": "free-text",
   *         "__v": 0
   *     }
   */
  @Get('/:id/assignments/:user/files')
  @Authorized(['teacher'])
  async downloadFilesOfSingleAssignment(@Param('id') id: string, @Param('user') userId: string, @Res() response: Response) {
    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id);

    if (!assignmentUnit) {
      throw new NotFoundError();
    }

    const assignment = assignmentUnit.assignments.find(row => `${row.user._id}` === userId);
    if (!assignment.files.length) {
      return;
    }

    const user = await User.findById(assignment.user);
    const filepath = `${config.tmpFileCacheFolder}${user.profile.lastName}_${assignmentUnit.name}.zip`;

    const output = fs.createWriteStream(filepath);
    const archive = archiver('zip', {
      zlib: {level: 9}
    });

    archive.pipe(output);

    for (const fileMetadata of assignment.files) {
      const file = await File.findById(fileMetadata);

      archive
        .file(`uploads/${file.link}`, {
          name: user.profile.lastName + '_' +
            user.profile.firstName + '_' + file.name
        });
    }

    archive.on('error', () => {
      throw new NotFoundError();
    });


    await this.waitForArchiveToFinish(output, archive);

    response.status(200);
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await promisify<string, void>(response.download.bind(response))(filepath);

    return response;
  }

  /**
   * @api {get} /api/units/:id/assignments Request unit
   * @apiName GetUnit
   * @apiGroup Unit
   *
   * @apiParam {String} id Unit ID.
   *
   * @apiSuccess {Unit} unit Unit.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6b60f72236d8e7c858",
   *         "updatedAt": "2017-11-08T22:00:11.500Z",
   *         "createdAt": "2017-11-08T22:00:11.500Z",
   *         "name": "What is Lorem Ipsum?",
   *         "description": "...",
   *         "markdown": "# What is Lorem Ipsum?\n**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.",
   *         "_course": "5a037e6b60f72236d8e7c83b",
   *         "unitCreator": "5a037e6b60f72236d8e7c834",
   *         "type": "free-text",
   *         "__v": 0
   *     }
   */
  @Get('/:id/assignments/files')
  @Authorized(['teacher'])
  async getAllAssignments(@Param('id') id: string, @Res() response: Response) {
    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id);

    if (!assignmentUnit) {
      throw new NotFoundError();
    }

    const filepath = config.tmpFileCacheFolder + assignmentUnit.name + '.zip';

    const output = fs.createWriteStream(filepath);
    const archive = archiver('zip', {
      zlib: {level: 9}
    });

    archive.pipe(output);


    for (const assignment of assignmentUnit.assignments) {
      const user = await User.findById(assignment.user);

      for (const fileMetadata of assignment.files) {
        const file = await File.findById(fileMetadata);
        archive
          .file(`uploads/${file.link}`, {
            name: user.profile.lastName + '_' +
              user.profile.firstName + '_' + file.name
          });
      }
    }

    archive.on('error', () => {
      throw new NotFoundError();
    });

    await this.waitForArchiveToFinish(output, archive);

    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await promisify<string, void>(response.download.bind(response))(filepath);

    return response;
  }

  private pushToLecture(lectureId: string, unit: any) {
    return Lecture.findById(lectureId)
      .then((lecture) => {
        lecture.units.push(unit);
        return lecture.save();
      })
      .then(() => {
        return unit.populateUnit();
      })
      .then((populatedUnit) => {
        return populatedUnit.toObject();
      })
      .catch((err) => {
        throw new BadRequestError(err);
      });
  }

  private checkPostParam(data: any) {
    if (!data.lectureId) {
      throw new BadRequestError(errorCodes.unit.postMissingLectureId.text);
    }

    if (!data.model) {
      throw new BadRequestError(errorCodes.unit.postMissingUnit.text);
    }

    if (!data.model._course) {
      throw new BadRequestError(errorCodes.unit.postMissingCourse.text);
    }
  }
}
