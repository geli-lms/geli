
import {expect} from 'chai';
import {addTwo} from '../../src/test';
const fs = require('fs');

describe('Test CSV', () => {

  it('Should add two to input', () => {
    const input = 5;
    const result = addTwo(input);
    expect(result).to.eq(input + 2);
  });
});
