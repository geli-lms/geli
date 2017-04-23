"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const routing_controllers_1 = require("routing-controllers");
const body_parser_1 = require("body-parser");
const passportLoginMiddleware_1 = require("../security/passportLoginMiddleware");
const main_1 = require("../config/main");
const User_1 = require("../models/User");
let UserController = UserController_1 = class UserController {
    static generateToken(user) {
        return jsonwebtoken_1.sign({ _id: user._id }, main_1.default.secret, {
            expiresIn: 10080 // in seconds
        });
    }
    getCourses() {
        return User_1.User.find({})
            .then((user) => user.map((c) => c.toObject({ virtuals: true })));
    }
    postLogin(request) {
        const user = request.user;
        return {
            token: 'JWT ' + UserController_1.generateToken(user),
            user: user.toObject()
        };
    }
    postRegister(user, res) {
        return User_1.User.findOne({ email: user.email })
            .then((existingUser) => {
            // If user is not unique, return error
            if (existingUser) {
                throw new routing_controllers_1.HttpError(422, 'That email address is already in use.');
            }
            return new User_1.User(user).save();
        })
            .then((savedUser) => {
            return {
                token: 'JWT ' + UserController_1.generateToken(savedUser),
                user: savedUser.toObject()
            };
        });
    }
};
__decorate([
    routing_controllers_1.Get('/'),
    routing_controllers_1.UseBefore(body_parser_1.json(), passportLoginMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getCourses", null);
__decorate([
    routing_controllers_1.Post('/login'),
    routing_controllers_1.UseBefore(body_parser_1.json(), passportLoginMiddleware_1.default) // We need body-parser for passport to find the credentials
    ,
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "postLogin", null);
__decorate([
    routing_controllers_1.Post('/register'),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "postRegister", null);
UserController = UserController_1 = __decorate([
    routing_controllers_1.JsonController('/user')
], UserController);
exports.UserController = UserController;
var UserController_1;
