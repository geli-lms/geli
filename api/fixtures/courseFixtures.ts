/* tslint:disable:max-line-length */
import {IFixture} from './IFixture';
import {Course} from '../src/models/Course';

export const courseFixtures: IFixture = {
  Model: Course,
  data: [
    {
      name: 'Dump Test',
      description: 'This is a totally dump test-course',
      courseAdmin: null,
      teachers: [],
      students: [],
      active: true
    },
    {
      name: 'Introduction to web development',
      description: `Whether you're just getting started with Web development, or are just expanding your horizons into new realms of Web awesomeness, this course should help you get started.`,
      courseAdmin: null,
      teachers: [],
      students: [],
      active: true
    },
    {
      name: 'Advanced web development',
      description: 'Learn all the things! Angular, Node, Express, MongoDB, TypeScript ...',
      courseAdmin: null,
      teachers: [],
      students: [],
      active: true
    },
    {
      name: 'Computer Graphics',
      description: 'Learn all about video and picture analysis/rendering',
      courseAdmin: null,
      teachers: [],
      students: [],
      active: true
    },
    {
      name: 'Science of randomness',
      description: 'Nothing is really random! Or is it?',
      courseAdmin: null,
      teachers: [],
      students: [],
      active: true
    },
    {
      name: 'Secrets of MPSE',
      description: 'Tips, Tricks and Hints for a successful university live',
      accessKey: 'test',
      courseAdmin: null,
      teachers: [],
      students: [],
      active: true
    },
  ]
};
