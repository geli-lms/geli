import {
  Authorized, Body, Delete, Get, JsonController, Post, Param, Put, QueryParam, UseBefore,
  HttpError, BadRequestError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {isNullOrUndefined} from 'util';
import {WhitelistUser} from '../models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {errorCodes} from '../config/errorCodes';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course} from '../models/Course';
import {User} from '../models/User';

function escapeRegex(text: string) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

@JsonController('/whitelist')
@UseBefore(passportJwtMiddleware)
export class WitelistController {

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return WhitelistUser.findById(id)
      .then((whitelistUser) => {
        return whitelistUser.toObject({virtuals: true});
      });
  }

  @Post('/')
  @Authorized(['teacher', 'admin'])
  async addWhitelistUser(@Body() whitelistUser: IWhitelistUser) {
    let savedWhitelistUser;
    try {
      savedWhitelistUser = await new WhitelistUser(this.toMongooseObjectId(whitelistUser)).save();
    } catch (err) {
      throw new BadRequestError(errorCodes.whitelist.duplicateWhitelistUser.text);
    }
    await this.addUserIfFound(whitelistUser);
    return savedWhitelistUser.toObject();
  }

  @Put('/:id')
  @Authorized(['teacher', 'admin'])
  async updateWhitelistUser(@Param('id') id: string, @Body() whitelistUser: IWhitelistUser) {
    let updatedWhitelistUser;
    const foundWhitelistUser = await WhitelistUser.findById(id);
    try {
      updatedWhitelistUser = await WhitelistUser.findOneAndUpdate(
        this.toMongooseObjectId(whitelistUser),
        {'new': true});
    } catch (err) {
      throw new BadRequestError(errorCodes.whitelist.duplicateWhitelistUser.text);
    }
    await this.deleteUserIfFound(foundWhitelistUser);
    await this.addUserIfFound(updatedWhitelistUser);
    return updatedWhitelistUser ? updatedWhitelistUser.toObject() : undefined;
  }

  @Delete('/:id')
  @Authorized(['teacher', 'admin'])
  async deleteWhitelistUser(@Param('id') id: string) {
    const whitelistUser = await WhitelistUser.findByIdAndRemove(id);
    await this.deleteUserIfFound(whitelistUser);
    return {result: true};
  }

  toMongooseObjectId(whitelistUser: IWhitelistUser) {
    return {
      _id: whitelistUser._id,
      firstName: whitelistUser.firstName,
      lastName: whitelistUser.lastName,
      uid: whitelistUser.uid,
      courseId: new ObjectId(whitelistUser.courseId)
    }
  }

  private async deleteUserIfFound(whitelistUser: IWhitelistUser) {
    const course = await Course.findById(whitelistUser.courseId)
      .populate('students');
    if (course) {
      course.students = course.students.filter(stud => stud.uid !== whitelistUser.uid);
      await course.update(course);
    }
  }

  private async addUserIfFound(whitelistUser: IWhitelistUser) {
    const [course, stud] = await Promise.all([
      Course.findById(whitelistUser.courseId)
        .populate('students'),
      User.findOne({
        uid: whitelistUser.uid,
        'profile.firstName': { $regex: new RegExp(whitelistUser.firstName.toLowerCase(), 'i') } ,
        'profile.lastName': { $regex: new RegExp(whitelistUser.lastName.toLowerCase(), 'i')}})]);
    console.log(whitelistUser);
    console.log('Gefunden:' + stud);
    if (course && stud) {
      course.students.push(stud);
      await course.update(course);
    }
  }
}
