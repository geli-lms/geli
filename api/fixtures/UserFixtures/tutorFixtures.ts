import {IFixture} from '../IFixture';
import {User} from '../../src/models/User';

export const tutorFixtures: IFixture = {
  Model: User,
  data: [
    {
      uid: '998745',
      email: 'tutor1@test.local',
      password: 'test',
      role: 'tutor',
      profile: {
        firstName: 'Tick',
        lastName: 'Tut'
      },
      isActive: true
    },
    {
      uid: '996548',
      email: 'tutor2@test.local',
      password: 'test',
      role: 'tutor',
      profile: {
        firstName: 'Trick',
        lastName: 'Tut'
      },
      isActive: true
    },
  ]
};
