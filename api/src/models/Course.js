"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const User_1 = require("./User");
const Lecture_1 = require("./Lecture");
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    active: {
        type: Boolean
    },
    description: {
        type: String
    },
    courseAdmin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User_1.User
        }
    ],
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User_1.User
        }
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Lecture_1.Lecture
        }
    ],
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret) {
            ret._id = ret.id;
            delete ret.id;
        }
    }
});
const Course = mongoose.model('Course', courseSchema);
exports.Course = Course;
