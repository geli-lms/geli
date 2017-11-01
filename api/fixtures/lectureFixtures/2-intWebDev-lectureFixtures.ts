/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {Lecture} from '../../src/models/Lecture';

export const webDevelopmentLectureFixtures: IFixture = {
  Model: Lecture,
  data: [
    {
      name: 'Introduction',
      description: 'something about me, us, whoever',
    },
    {
      name: 'Coding Train',
      description: 'evaluate your coding skillz',
    },
    {
      name: 'Funny Time :)',
      description: 'the most dump solutions',
    },
  ]
};
