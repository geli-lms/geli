import {IFixture} from './IFixture';
import {Unit} from '../src/models/units/Unit';

export const unitFixtures: IFixture = {
  Model: Unit,
  data: [
    {
      title: 'AWD - Unit 1',
      progressable: true,
      weight: 0
    },
    {
      title: 'AWD - Unit 2',
      progressable: true,
      weight: 1
    }
  ]
};
