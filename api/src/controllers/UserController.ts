import {Body, Post, JsonController, Req, Res, HttpError, UseBefore, BodyParam} from "routing-controllers";
import passportJwtMiddleware from "../security/passportJwtMiddleware";

@JsonController("/user")
@UseBefore(passportJwtMiddleware)
export class UserController {
}