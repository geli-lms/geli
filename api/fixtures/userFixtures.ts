import {IFixture} from './IFixture';
import {User} from '../src/models/User';

export const userFixtures: IFixture = {
  Model: User,
  data: [
    {
      uid: '123456',
      username: 'TStud1',
      email: 'student1@test.local',
      password: 'test',
      profile: {
        firstName: 'Tick',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      uid: '654321',
      username: 'TStud2',
      email: 'student2@test.local',
      password: 'test',
      profile: {
        firstName: 'Trick',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      uid: '321654',
      username: 'TStud3',
      email: 'student3@test.local',
      password: 'test',
      profile: {
        firstName: 'Track',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      username: 'DAdmin',
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
      username: 'DTeach',
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
