/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {Lecture} from '../../src/models/Lecture';

export const mpseLectureFixtures: IFixture = {
  Model: Lecture,
  data: [
    {
      name: 'Introduction',
      description: 'something copied from some site',
    },
    {
      name: 'Facts about this Project',
      description: 'any old readme',
    },
    {
      name: 'Student Book',
      description: 'add some funny fixture Units here',
    },
  ]
};
