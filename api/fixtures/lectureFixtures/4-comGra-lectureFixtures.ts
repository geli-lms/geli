/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {Lecture} from '../../src/models/Lecture';

export const computerGraphicsLectureFixtures: IFixture = {
  Model: Lecture,
  data: [
    {
      name: 'Introduction',
      description: 'some historical shit that noone wants o know',
    },
    {
      name: 'Theoretics',
      description: 'well... they will hate you...',
    },
    {
      name: 'Some exercises',
      description: 'code some basic examples',
    },
    {
      name: 'Project Time',
      description: 'finally getting to the interesting things',
    },
  ]
};
