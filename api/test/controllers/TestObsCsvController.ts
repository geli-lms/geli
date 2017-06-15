
import {expect} from 'chai';
import {addTwo} from '../../src/test';
import fs = require('fs');

describe('Test CSV', () => {
  const file: string = fs.readFileSync('./test/resources/ObsCSVTestfilePass.csv');
  console.log(file);
  it('Should add two to input', () => {
    const input = 5;
    const result = addTwo(input);
    expect(result).to.eq(input + 2);
  });
});
