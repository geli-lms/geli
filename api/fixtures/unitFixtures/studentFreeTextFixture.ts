/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {FreeTextUnit} from '../../src/models/units/FreeTextUnit';

// TODO: Load this fixtures
export const studentFreeTextFixture: IFixture = {
  Model: FreeTextUnit,
  data: [
    {
      name: 'Number one',
      description: 'Ken Hasenbank',
      markdown: '### Ouch \nTook me a bunch of brain cells coding this....'
    },
  ]
};
