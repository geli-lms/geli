/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {Lecture} from '../../src/models/Lecture';

export const dumpTestLectureFixtures: IFixture = {
  Model: Lecture,
  data: [
    {
      name: 'Lecture 1',
      description: 'Description Lecture 1',
    },
    {
      name: 'Lecture2',
      description: 'Description Lecture 2',
    },
    {
      name: 'Lecture3',
      description: 'Description Lecture 3',
    },
  ]
};
