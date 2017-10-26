import {IFixture} from '../IFixture';
import {CodeKataUnit} from '../../src/models/units/CodeKataUnit';

export const studentCodeKataFixture: IFixture = {
  Model: CodeKataUnit,
  data: [
    {
      name: 'Magic do not touch',
      description: '...',
      progressable: true,
      weight: 0,
      type: 'code-kata',
      definition: '// guess my number' +
      '\n// let me give you a hint --- you can\'t make this pass until you can make an infinite recursive function return' +
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
