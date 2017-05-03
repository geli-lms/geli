import {IFixture} from './IFixture';
import {User} from '../src/models/User';

export const userFixtures: IFixture = {
  Model: User,
  data: [
    {
      email: 'student1@test.local',
      password: 'test',
      profile: {
        firstName: 'Tick',
        lastName: 'Studi'
      },
    },
    {
      email: 'student2@test.local',
      password: 'test',
      profile: {
        firstName: 'Trick',
        lastName: 'Studi'
      },
    },
    {
      email: 'student3@test.local',
      password: 'test',
      profile: {
        firstName: 'Track',
        lastName: 'Studi'
      },
    },
    {
      email: 'admin@test.local',
      password: 'test',
      role: 'admin',
      profile: {
        firstName: 'Dago',
        lastName: 'Adminman'
      },
    },
    {
      email: 'teacher@test.local',
      password: 'test',
      role: 'teacher',
      profile: {
        firstName: 'Daniel',
        lastName: 'Teachman'
      },
    }
  ]
};
