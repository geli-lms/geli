import {IFixture} from './IFixture';
import {Progress} from '../src/models/Progress';

export const progressFixtures: IFixture = {
  Model: Progress,
  data: [
    {
      user: null,
      unit: null,
      done: true
    },
    {
      user: null,
      unit: null,
      done: false
    }
  ]
};
