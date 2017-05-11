import {expect} from 'chai';
import {addTwo} from '../../src/test';

describe('Testing demo function', () => {
    it('Should add two to input', () => {
        const input = 5;
        const result = addTwo(input);
        expect(result).to.eq(input + 2);
    });
});
