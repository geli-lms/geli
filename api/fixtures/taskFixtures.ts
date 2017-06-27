/* tslint:disable:max-line-length */
import {IFixture} from './IFixture';
import {Task} from '../src/models/Task';

// TODO: Load this fixtures
export const taskFixtures: IFixture = {
  Model: Task,
  data: [
    {
      courseId: '0',
      question: 'Wer wird Bundeskanzler 2017?',
      answers: [{
        value: true,
        text: 'Merkel'}, {
        value: false,
        text: 'Schulz'
      }]
    },
  ]
};
