import {IFixture} from './IFixture';
import {Unit} from '../src/models/units/Unit';
import {TaskUnit} from '../src/models/units/TaskUnit';

export const unitFixtures: IFixture = {
  Model: TaskUnit,
  data: [
    {
      name: 'AWD - Unit 1',
      progressable: true,
      weight: 0,
      type: 'task',
      tasks: []
    },
    {
      name: 'AWD - Unit 2',
      progressable: true,
      weight: 1,
      type: 'task',
      tasks: []
    }
  ]
};
