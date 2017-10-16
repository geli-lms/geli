import {IFixture} from '../IFixture';
import {User} from '../../src/models/User';

export const studentFixtures: IFixture = {
  Model: User,
  data: [
    {
      uid: '123456',
      email: 'student1@test.local',
      password: 'test',
      role: 'student',
      profile: {
        firstName: 'Tick',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      uid: '234567',
      email: 'student2@test.local',
      password: 'test',
      role: 'student',
      profile: {
        firstName: 'Trick',
        lastName: 'Studi'
      },
      isActive: true
    },
    {
      uid: '345678',
      email: 'student3@test.local',
      password: 'test',
      role: 'student',
      profile: {
        firstName: 'Track',
        lastName: 'Studi'
      },
      isActive: true
    },
  ]
};
