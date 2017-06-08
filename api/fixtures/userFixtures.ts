import {IFixture} from './IFixture';
import {User} from '../src/models/User';

export const userFixtures: IFixture = {
  Model: User,
  data: [
    {
      uid: '123456',
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
    },
    {
      email: 'teacher2@test.local',
      password: 'test',
      role: 'teacher',
      profile: {
        firstName: 'Ober',
        lastName: 'Lehrer'
      },
      isActive: true
    },
    {
      email: 'teacher3@test.local',
      password: 'test',
      role: 'teacher',
      profile: {
        firstName: 'Ober',
        lastName: 'Streber'
      },
      isActive: true
    },
    {
      email: 'teacher4@test.local',
      password: 'test',
      role: 'teacher',
      profile: {
        firstName: 'Severus',
        lastName: 'Snap'
      },
      isActive: true
    }
  ]
};
