/* tslint:disable:max-line-length */
import {IFixture} from './IFixture';
import {Task} from '../src/models/Task';
/*

 tests für task CRUD, die ich durchgeführt habe
 empty: create taskunit->create task
 empty: create taskunit+task
 empty: create taskunit+tasks

 delete task
 delete taskunit

 edit task text
 create task answer
 edit task answer
 delete task answer
 */
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
