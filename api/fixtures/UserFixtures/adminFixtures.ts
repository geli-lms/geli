import {IFixture} from '../IFixture';
import {User} from '../../src/models/User';

export const adminFixtures: IFixture = {
  Model: User,
  data: [
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
  ]
};
