"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Unit_1 = require("./Unit");
const lectureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    units: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Unit_1.Unit
        }
    ]
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret) {
            ret._id = ret.id;
            delete ret.id;
        }
    }
});
const Lecture = mongoose.model('Lecture', lectureSchema);
exports.Lecture = Lecture;
