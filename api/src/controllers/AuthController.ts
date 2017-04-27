import {sign} from "jsonwebtoken";
import {Response} from "express";
import {Body, Post, JsonController, Req, Res, HttpError, UseBefore, BodyParam} from "routing-controllers";
import {json as bodyParserJson} from "body-parser";
import passportLoginMiddleware from "../security/passportLoginMiddleware";
import emailService from "../services/EmailService";

import config from "../config/main";
import {IUser} from "../models/IUser";
import {IUserModel, User} from "../models/User";

@JsonController("/auth")
export class AuthController {

    static generateToken(user: IUser) {
        return sign(
            {_id: user._id},
            config.secret,
            {
                expiresIn: 10080 // in seconds
            }
        );
    }

    @Post("/login")
    @UseBefore(bodyParserJson(), passportLoginMiddleware) // We need body-parser for passport to find the credentials
    postLogin(@Req() request: Request) {
        const user = <IUserModel>(<any>request).user;

        return {
            token: "JWT " + AuthController.generateToken(user),
            user: user.toObject()
        };
    }

    @Post("/register")
    postRegister(@Body() user: IUser, @Res() res: Response) {
        return User.findOne({email: user.email})
            .then((existingUser) => {
                // If user is not unique, return error
                if (existingUser) {
                    throw new HttpError(422, "That email address is already in use.");
                }

                return new User(user).save();
            })
            .then((user) => {
                emailService.sendActivation(user);

                return {
                    token: "JWT " + AuthController.generateToken(user),
                    user: user.toObject()
                };
            });
    }

    @Post("/activate")
    postActivation(@BodyParam("authenticationToken") authenticationToken: String) {
        return User.findOne({authenticationToken: authenticationToken})
            .then((existingUser) => {
                if (!existingUser) {
                    throw new HttpError(422, "could not activate user");
                }

                existingUser.authenticationToken = undefined;
                return existingUser.save();
            })
            .then((user) => {
                return {
                    token: "JWT " + AuthController.generateToken(user),
                    user: user.toObject()
                };
            });
    }
}
