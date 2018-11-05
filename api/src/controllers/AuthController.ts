import {Response} from 'express';
import {
  Body, Delete, Post, JsonController, Req, HttpError, UseBefore, BodyParam, ForbiddenError,
  InternalServerError, BadRequestError, OnUndefined, Res
} from 'routing-controllers';
import {json as bodyParserJson} from 'body-parser';
import passportLoginMiddleware from '../security/passportLoginMiddleware';
import emailService from '../services/EmailService';
import {IUser} from '../../../shared/models/IUser';
import {IUserModel, User} from '../models/User';
import {JwtUtils} from '../security/JwtUtils';
import * as errorCodes from '../config/errorCodes';
import {Course} from '../models/Course';
import config from '../config/main';

@JsonController('/auth')
export class AuthController {

  /**
   * @api {post} /api/auth/login Login user by responding with a httpOnly JWT cookie and the user's IUserModel data.
   * @apiName PostAuthLogin
   * @apiGroup Auth
   *
   * @apiParam {Request} request Login request (with email and password).
   *
   * @apiSuccess {IUserModel} user Authenticated user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "user": {
   *             "_id": "5a037e6a60f72236d8e7c813",
   *             "updatedAt": "2018-01-08T19:24:26.522Z",
   *             "createdAt": "2017-11-08T22:00:10.897Z",
   *             "email": "admin@test.local",
   *             "__v": 0,
   *             "isActive": true,
   *             "lastVisitedCourses": [],
   *             "role": "admin",
   *             "profile": {
   *                 "firstName": "Dago",
   *                 "lastName": "Adminman",
   *                 "picture": {}
   *             },
   *             "id": "5a037e6a60f72236d8e7c813"
   *         }
   *     }
   */
  @Post('/login')
  @UseBefore(bodyParserJson(), passportLoginMiddleware) // We need body-parser for passport to find the credentials
  postLogin(@Req() request: any, @Res() response: Response) {
    const user: IUserModel = request.user;
    response.cookie('token', JwtUtils.generateToken(user), {
      httpOnly: true,
      sameSite: true,
      // secure: true, // TODO Maybe make this configurable?
    });
    response.json({
      user: user.toObject()
    });
    return response;
  }

  /**
   * @api {delete} /api/auth/logout Logout user by clearing the httpOnly token cookie.
   * @apiName AuthLogout
   * @apiGroup Auth
   *
   * @apiSuccessExample {json} Success-Response:
   *      {}
   */
  @Delete('/logout')
  logout(@Res() response: Response) {
    response.clearCookie('token');
    response.json({});
    return response;
  }

  /**
   * @api {post} /api/auth/register Register user
   * @apiName PostAuthRegister
   * @apiGroup Auth
   *
   * @apiParam {IUser} user New user to be registered.
   *
   * @apiError BadRequestError That matriculation number is already in use
   * @apiError BadRequestError That email address is already in use
   * @apiError BadRequestError You can only sign up as student or teacher
   * @apiError BadRequestError You are not allowed to register as teacher
   * @apiError InternalServerError Could not send E-Mail
   */
  @Post('/register')
  @OnUndefined(204)
  async postRegister(@Body() user: IUser) {
    const existingUser = await User.findOne({$or: [{email: user.email}, {uid: user.uid}]});
    // If user is not unique, return error
    if (existingUser) {
      if (user.role === 'student' && existingUser.uid === user.uid) {
        throw new BadRequestError(errorCodes.errorCodes.duplicateUid.code);
      }
      if (existingUser.email === user.email) {
        throw new BadRequestError(errorCodes.errorCodes.mail.duplicate.code);
      }
    }
    if (user.role !== 'teacher' && user.role !== 'student') {
      throw new BadRequestError('You can only sign up as student or teacher');
    }
    if (user.role === 'teacher' && (typeof user.email !== 'string' || !user.email.match(config.teacherMailRegex))) {
      throw new BadRequestError(errorCodes.errorCodes.mail.noTeacher.code);
    }
    const newUser = new User(user);
    const savedUser = await newUser.save();
    // User can now match a whitelist.
    await this.addWhitelistedUserToCourses(savedUser);
    try {
      emailService.sendActivation(savedUser);
    } catch (err) {
      throw new InternalServerError(errorCodes.errorCodes.mail.notSend.code);
    }
  }

  /**
   * @api {post} /api/auth/activate Activate user
   * @apiName PostAuthActivate
   * @apiGroup Auth
   *
   * @apiParam {string} authenticationToken Authentication token.
   *
   * @apiSuccess {Boolean} success Confirmation of activation.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "success": true
   *     }
   *
   * @apiError HttpError 422 - could not activate user
   */
  // TODO If activate user and is in playlist add to course.
  @Post('/activate')
  postActivation(@BodyParam('authenticationToken') authenticationToken: string) {
    return User.findOne({authenticationToken: authenticationToken})
      .then((existingUser) => {
        if (!existingUser) {
          throw new HttpError(422, 'could not activate user');
        }

        existingUser.authenticationToken = undefined;
        existingUser.isActive = true;
        return existingUser.save();
      })
      .then((user) => {
        return {success: true};
      });
  }


  /**
   * @api {post} /api/auth/activationresend Resend Activation
   * @apiName ActivationResend
   * @apiGroup Auth
   *
   * @apiParam {string} lastname lastname of user which activation should be resend.
   * @apiParam {string} uid matriculation number of user which activation should be resend.
   * @apiParam {string} email email the new activation should be sent to.
   *
   * @apiError (BadRequestError) 400 User was not found.
   * @apiError (BadRequestError) 400 That email address is already in use
   * @apiError (BadRequestError) 400 User is already activated.
   * @apiError (HttpError) 503 You can only resend the activation every X minutes. Your next chance is in
   * time left till next try in 'try-after' header in seconds
   * @apiError (InternalServerError) Could not send E-Mail
   */
  @Post('/activationresend')
  @OnUndefined(204)
  async activationResend (@BodyParam('lastname') lastname: string,
                                      @BodyParam('uid') uid: string,
                                      @BodyParam('email') email: string,
                                      @Res() response: Response) {
        const user = await User.findOne({'profile.lastName': lastname, uid: uid, role: 'student'});

        if (!user) {
          throw new BadRequestError(errorCodes.errorCodes.user.userNotFound.code);
        }

        if (user.isActive) {
          throw new BadRequestError(errorCodes.errorCodes.user.userAlreadyActive.code);
        }

        const timeSinceUpdate: number = (Date.now() - user.updatedAt.getTime() ) / 60000;
        if (timeSinceUpdate < Number(config.timeTilNextActivationResendMin)) {
          const retryAfter: number = (Number(config.timeTilNextActivationResendMin) - timeSinceUpdate) * 60;
          response.set('retry-after', retryAfter.toString());
          throw new HttpError(503, errorCodes.errorCodes.user.retryAfter.code);
        }

        const existingUser = await User.findOne({email: email});
        if (existingUser && existingUser.uid !== uid) {
          throw new BadRequestError(errorCodes.errorCodes.mail.duplicate.code);
        }

        user.authenticationToken = undefined;
        user.email = email;
        const savedUser = await user.save();

        try {
          await emailService.resendActivation(savedUser);
        } catch (err) {
          throw new InternalServerError(err.toString());
        }
  }

  /**
   * @api {post} /api/auth/reset Reset password
   * @apiName PostAuthReset
   * @apiGroup Auth
   *
   * @apiParam {string} resetPasswordToken Authentication token.
   * @apiParam {string} newPassword New password.
   *
   * @apiSuccess {Boolean} success Confirmation of reset.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "success": true
   *     }
   *
   * @apiError HttpError 422 - could not reset users password
   * @apiError ForbiddenError your reset password token is expired
   */
  @Post('/reset')
  postPasswordReset(@BodyParam('resetPasswordToken') resetPasswordToken: string, @BodyParam('newPassword') newPassword: string) {
    return User.findOne({resetPasswordToken: resetPasswordToken})
      .then((existingUser) => {
        if (!existingUser) {
          throw new HttpError(422, 'could not reset users password');
        }
        if (existingUser.resetPasswordExpires < new Date()) {
          throw new ForbiddenError('your reset password token is expired');
        }

        existingUser.password = newPassword;
        existingUser.resetPasswordToken = undefined;
        existingUser.resetPasswordExpires = undefined;
        existingUser.markModified('password');
        return existingUser.save();
      })
      .then((savedUser) => {
        return {success: true};
      });
  }

  /**
   * @api {post} /api/auth/requestreset Request password reset
   * @apiName PostAuthRequestReset
   * @apiGroup Auth
   *
   * @apiParam {string} email Email to notify.
   *
   * @apiSuccess {Boolean} success Confirmation of email transmission.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "success": true
   *     }
   *
   * @apiError HttpError 422 - could not reset users password
   * @apiError InternalServerError Could not send E-Mail
   */
  @Post('/requestreset')
  postRequestPasswordReset(@BodyParam('email') email: string) {
    return User.findOne({email: email})
      .then((existingUser) => {
        if (!existingUser) {
          throw new HttpError(422, 'could not reset users password');
        }

        const expires = new Date();
        expires.setTime((new Date()).getTime()
          // Add 24h
          + (24 * 60 * 60 * 1000));

        existingUser.resetPasswordExpires = expires;
        return existingUser.save();
      })
      .then((user) => {
        return emailService.sendPasswordReset(user);
      })
      .then(() => {
        return {success: true};
      })
      .catch((err) => {
        throw new InternalServerError('Could not send E-Mail');
      });
  }

  /**
   * Add new user to all whitelisted courses in example after registration.
   * @param {IUser} user
   * @returns {Promise<void>}
   */
  private async addWhitelistedUserToCourses(user: IUser) {
    const courses = await Course.find(
      {enrollType: 'whitelist'}).populate('whitelist');

    await Promise.all(
      courses.map(async (course) => {
        const userUidIsRegisteredInWhitelist = course.whitelist.findIndex(w => w.uid === user.uid) >= 0;
        const userIsntAlreadyStudentOfCourse = course.students.findIndex(u => u._id === user._id) < 0;
        if (userUidIsRegisteredInWhitelist && userIsntAlreadyStudentOfCourse) {
          course.students.push(user);
          await Course.update({_id: course._id}, course);
        }
      }));
  }
}
