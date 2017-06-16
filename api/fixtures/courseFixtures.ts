/* tslint:disable:max-line-length */
import {IFixture} from './IFixture';
import {Course} from '../src/models/Course';

export const courseFixtures: IFixture = {
  Model: Course,
  data: [
    {
      name: 'Introduction to web development',
      description: `Whether you're just getting started with Web development, or are just expanding your horizons into new realms of Web awesomeness, this course should help you get started.`,
      accessKey: 'test',
      active: true
    },
    {
      name: 'Advanced web development',
      description: 'Learn all the things! Angular, Node, Express, MongoDB, TypeScript ...',
      active: true
    },
  ]
};
