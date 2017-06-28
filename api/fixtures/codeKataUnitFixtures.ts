import {IFixture} from './IFixture';
import {CodeKataUnit} from '../src/models/units/CodeKataUnit';

export const codeKataUnitFixtures: IFixture = {
  Model: CodeKataUnit,
  data: [
    {
      name: 'Search and Replace',
      description: '...',
      progressable: true,
      weight: 0,
      type: 'code-kata',
      definition: '// Task: Manipulate the targetSet, so it only contains the values "Hello" and "h_da"' +
      '\n' +
      '\nlet targetSet = new Set(["Hello", "there"]);',
      code: 'targetSet.add("h_da");' +
      '\ntargetSet.delete("there");',
      test: 'validate();' +
      '\n' +
      '\nfunction validate() {' +
      '\n\treturn targetSet.has("Hello") && targetSet.has("h_da") && targetSet.size === 2;' +
      '\n' +
      '}'
    }, {
      name: 'Generator',
      description: 'generate some numbers',
      progressable: true,
      weight: 1,
      type: 'code-kata',
      definition: '// Task: Generate all numbers between 1 and 100, that are divisible by 3 AND 5' +
      '\n' +
      '\nlet min = 1;' +
      '\nlet max = 100;' +
      '\nlet genNumbers = [];',
      code: 'for (let i = min; i <= max; i++) {' +
      '\n\tif (i % 3 === 0 && i % 5 === 0) {' +
      '\n\t\tgenNumbers.push(i);' +
      '\n\t}' +
      '\n}',
      test: 'validate();' +
      '\n' +
      '\nfunction validate() {' +
      '\n\treturn genNumbers.join(",") === "15,30,45,60,75,90";' +
      '\n}'
    }
  ]
};
