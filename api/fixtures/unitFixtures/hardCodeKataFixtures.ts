import {IFixture} from '../IFixture';
import {CodeKataUnit} from '../../src/models/units/CodeKataUnit';

export const hardCodeKataFixture: IFixture = {
  Model: CodeKataUnit,
  data: [
    {
      name: 'Chuck Norris guess',
      description: '...',
      progressable: true,
      weight: 0,
      type: 'code-kata',
      definition: '// guess my number' +
      '\n' +
      '\nlet guess = 0;',
      code: 'guess = Math.floor(Math.random() * 999) + 0',
      test: 'validate();' +
      '\n' +
      '\nfunction validate() {' +
      '\n\treturn guess === Math.floor(Math.random() * 999999) + 0' +
      '\n' +
      '}'
    },
  ]
};
