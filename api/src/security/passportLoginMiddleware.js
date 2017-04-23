"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = require("passport");
exports.default = passport_1.authenticate('local', { session: false });
