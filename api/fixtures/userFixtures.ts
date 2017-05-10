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
      isActive: true
    },
    {
      email: 'student2@test.local',
      password: 'test',
      profile: {
        firstName: 'Trick',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      email: 'student3@test.local',
      password: 'test',
      profile: {
        firstName: 'Track',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      email: 'admin@test.local',
      password: 'test',
      role: 'admin',
      profile: {
        firstName: 'Dago',
        lastName: 'Adminman'
      },
      isActive: true
    },
    {
      email: 'teacher@test.local',
      password: 'test',
      role: 'teacher',
      profile: {
        firstName: 'Daniel',
        lastName: 'Teachman'
      },
      isActive: true
    }
  ]
};
