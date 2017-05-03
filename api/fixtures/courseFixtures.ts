import {IFixture} from './IFixture';
import {Course} from '../src/models/Course';

export const courseFixtures: IFixture = {
  Model: Course,
  data: [
    {
      name: 'Advanced web development',
      active: true
    },
    {
      name: 'Introduction to web development',
      active: true
    }
  ]
};
