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
const routing_controllers_1 = require("routing-controllers");
const passportJwtMiddleware_1 = require("../security/passportJwtMiddleware");
const Course_1 = require("../models/Course");
let CourseController = class CourseController {
    getCourses() {
        return Course_1.Course.find({})
            .then((courses) => courses.map((c) => c.toObject({ virtuals: true })));
    }
    getCourse(id) {
        return Course_1.Course.findById(id)
            .then((c) => c.toObject());
    }
    addCourse(course, request) {
        course.courseAdmin = request.user;
        return new Course_1.Course(course).save()
            .then((c) => c.toObject());
    }
    updateCourse(id, course) {
        return Course_1.Course.findByIdAndUpdate(id, course, { 'new': true })
            .then((c) => c.toObject());
    }
};
__decorate([
    routing_controllers_1.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "getCourses", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "getCourse", null);
__decorate([
    routing_controllers_1.Post('/'),
    __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "addCourse", null);
__decorate([
    routing_controllers_1.Put('/:id'),
    __param(0, routing_controllers_1.Param('id')), __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "updateCourse", null);
CourseController = __decorate([
    routing_controllers_1.JsonController('/courses'),
    routing_controllers_1.UseBefore(passportJwtMiddleware_1.default)
], CourseController);
exports.CourseController = CourseController;
