"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    children: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Unit = mongoose.model('Unit', unitSchema);
exports.Unit = Unit;
