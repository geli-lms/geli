import {IFixture} from '../IFixture';
import {User} from '../../src/models/User';

export const teacherFixtures: IFixture = {
  Model: User,
  data: [
    {
      email: 'teacher1@test.local',
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
    },
  ]
};
