import {
  Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError, BadRequestError, Post,
  Authorized, CurrentUser, UploadedFile, Res
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {IUnitModel, Unit, AssignmentUnit} from '../models/units/Unit';
import {ValidationError} from 'mongoose';
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
   */
  @Get('/:id')
  async getUnit(@Param('id') id: string) {
    const unit = await Unit.findById(id);

    if (unit) {
      throw new NotFoundError();
    }
    return unit;
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
   * @apiError ValidationError
   */
  @Authorized(['teacher', 'admin'])
  @Post('/')
  async addUnit(@Body() data: any, @CurrentUser() currentUser: IUser) {
    // discard invalid requests
    this.checkPostParam(data);
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
   * @apiError NotFoundError
   * @apiError BadRequestError Invalid combination of file upload and unit data.
   * @apiError BadRequestError
   * @apiError ValidationError
   */
  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  async updateUnit(@Param('id') id: string, @Body() data: any) {
    const oldUnit: IUnitModel = await Unit.findById(id);

    if (!oldUnit) {
      throw new NotFoundError();
    }

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
   * @apiSuccess {Boolean} result Confirmation of deletion.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "result": true
   *     }
   *
   * @apiError NotFoundError
   */
  @Authorized(['teacher', 'admin'])
  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return Unit.findById(id).then((unit) => {
      if (!unit) {
        throw new NotFoundError();
      }

      return Lecture.update({}, {$pull: {units: id}})
        .then(() => unit.remove())
        .then(() => {
          return {result: true};
        });
    });
  }

  protected pushToLecture(lectureId: string, unit: any) {
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

  protected checkPostParam(data: any) {
    if (!data.lectureId) {
      throw new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      throw new BadRequestError('No unit was submitted.');
    }

    if (!data.model._course) {
      throw new BadRequestError('Unit has no _course set');
    }
  }

  /**
   * @api {post} /api/units/:id/assignment Add assignment
   * @apiName PostAssignment
   * @apiGroup Unit
   * @apiPermission student
   *
   * @apiParam {Object} file Uploaded file.
   *
   * @apiSuccess {boolean} success.
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
   * @apiError ValidationError
   */
  @Authorized(['student'])
  @Post('/:id/assignment')
  async addAssignment(@Param('id') id: string,
                      @UploadedFile('file', {options: uploadOptions}) uploadedFile: any,
                      @CurrentUser() currentUser: IUser) {

    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id);
    // Check Params file etc

    if (!assignmentUnit) {
      throw new NotFoundError();
    }

    for (const assignment of assignmentUnit.assignments) {
      if (assignment.user._id.toString() === currentUser._id) {
        throw new BadRequestError();
      }
    }


    try {
      const file: IFile = new File({
        name: uploadedFile.originalname,
        physicalPath: uploadedFile.path,
        link: uploadedFile.filename,
        size: uploadedFile.size,
        mimeType: uploadedFile.mimetype,
      });

      const savedFile = await new File(file).save();

      const assignment: IAssignment = {
        file: savedFile._id,
        user: currentUser._id,
        submitted: false,
        checked: 0,
      };

      assignmentUnit.assignments.push(assignment);
      await assignmentUnit.save();

      return true;
    } catch (err) {
      throw new BadRequestError(err);
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

    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id);

    /**
     * Simple workaround if user_id is not set. For some reason is the data.user._id not set if a student commits
     * an assignment...
     */
    const dataUserId = !data.user._id ? '' : data.user._id;

    if (!assignmentUnit) {
      throw new NotFoundError();
    }

    for (const assignment of assignmentUnit.assignments) {

      if ((assignment.user._id.toString() === currentUser._id && currentUser.role === 'student') ||
        (assignment.user._id.toString() === dataUserId.toString() &&
          (assignment.user._id.toString() === currentUser._id || currentUser.role === 'teacher' || currentUser.role === 'admin'))) {

        const index = assignmentUnit.assignments.indexOf(assignment);

        assignmentUnit.assignments[index].submitted = data.submitted;

        if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
          assignmentUnit.assignments[index].checked = data.checked;
        }

        try {
          await assignmentUnit.save();

          const progress: IProgress = new Progress({
            course: assignmentUnit._course._id,
            unit: assignmentUnit._id,
            user: currentUser._id,
            done: false,
          });

          await new Progress(progress).save();
        } catch (err) {
          if (err.name === 'ValidationError') {
            throw err;
          } else {
            throw new BadRequestError(err);
          }
        }
        return true;
      }
    }

    throw new NotFoundError();
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
  @Get('/:id/assignments')
  @Authorized(['teacher'])
  async getAllAssignments(@Param('id') id: string, @Res() response: Response) {
    const assignmentUnit = <IAssignmentUnitModel> await Unit.findById(id);

    if (!assignmentUnit) {
      throw new NotFoundError();
    }

    const hash = await crypto.createHash('sha1').update(id + assignmentUnit.assignments.length).digest('hex');
    const key = cache.get(hash);

    const filepath = config.tmpFileCacheFolder + assignmentUnit.name + '.zip';

    if (key === null) {

      const output = fs.createWriteStream(filepath);
      const archive = archiver('zip', {
        zlib: {level: 9}
      });

      archive.pipe(output);

      for (const assignment of assignmentUnit.assignments) {
        const file = await File.findById(assignment.file);
        console.log(assignment);
        const user = await User.findById(assignment.user);
        archive.file('uploads/' + file.link,
          {
            name: user.profile.lastName + '_' +
            user.profile.firstName + '_' + file.name
          });
      }

      archive.on('error', () => {
        throw new NotFoundError();
      });
      archive.finalize();

      cache.set(hash, assignmentUnit.name);
    }

    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    await promisify<string, void>(response.download.bind(response))(filepath);

    return response;
  }
}
