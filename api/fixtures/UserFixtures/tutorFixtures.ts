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
    {
      uid: '845218',
      email: 'tutor3@test.local',
      password: 'test',
      role: 'tutor',
      profile: {
        firstName: 'Track',
        lastName: 'Tut'
      },
      isActive: true
    },
    {
      uid: '625487',
      email: 'tutor4@test.local',
      password: 'test',
      role: 'tutor',
      profile: {
        firstName: 'Henning',
        lastName: 'Kiriasis'
      },
      isActive: true
    },
    {
      uid: '752314',
      email: 'tutor5@test.local',
      password: 'test',
      role: 'tutor',
      profile: {
        firstName: 'Lukas',
        lastName: 'Feige'
      },
      isActive: true
    },
  ]
};
