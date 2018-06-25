import {
  Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError, BadRequestError, Post,
  Authorized, CurrentUser, UploadedFile
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {ValidationError} from 'mongoose';
import {IUser} from '../../../shared/models/IUser';
import {IAssignment} from "../../../shared/models/assignment/IAssignment";
import config from "../config/main";
import {File} from "../models/mediaManager/File";
import {IFile} from "../../../shared/models/mediaManager/IFile";
import {IAssignmentUnit} from "../../../shared/models/units/IAssignmentUnit";

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
  @Post('/')
  async addAssignment(@Body() data: IAssignment, @Param('id') id: string, @UploadedFile('file', {options: uploadOptions}) uploadedFile: any, @CurrentUser() currentUser: IUser) {

    const assignmentUnit
    <AssignmentUnit> = Unit.findById(id);

    // Check Params file etc

    if (assignmentUnit || assignmentUnit.__t !== 'assignment') {
      throw new NotFoundError();
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

      assignment = new IAssignment({
        file: savedFile._id,
        user: currentUser._id,
        submitted: false,
        checked: 0,
      });

      assignmentUnit.assignments.push(assignment);
      assignmentUnit.save();
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
  @Put('/:id')
  async updateAssignment(@Param('id') id: string, @Body() data: IAssignment, @CurrentUser() currentUser: IUser) {
    const unit: IAssignmentUnit = await Unit.findById(id);

    if (!unit || unit.__t !== 'assignment') {
      throw new NotFoundError();
    }

    let oldAssignment;

    for (const assignment of unit.assignments) {
      if (assignment.user._id === currentUser._id) {
        assignment = data;
      }
    }

    if (!oldAssignment) {
      throw new NotFoundError();
    }

    try {
      await unit.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw err;
      } else {
        throw new BadRequestError(err);
      }
    }
  }

  /**
   * @api {delete} /api/units/:id/assignemtn Delete assignment
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
  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    const unit = await
    Unit.findById(id);

    if (!unit || unit.__t !== 'assignment') {
      throw new NotFoundError();
    }

    for (const assignment of unit.assignments) {
      if (assignment.user._id === currentUser._id) {
        delete assignment;
        await
        unit.save();
        return;
      }
    }

  }


}
