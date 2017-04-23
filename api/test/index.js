"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const test_1 = require("../src/test");
describe('Testing demo function', () => {
    it('Should add two to input', () => {
        const input = 5;
        const result = test_1.addTwo(input);
        chai_1.expect(result).to.eq(input + 2);
    });
});
