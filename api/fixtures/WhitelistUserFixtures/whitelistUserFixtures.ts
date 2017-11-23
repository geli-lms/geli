import {IFixture} from '../IFixture';
import {User} from '../../src/models/User';
import {WhitelistUser} from '../../src/models/WhitelistUser';

export const whitelistUserFixtures: IFixture = {
  Model: WhitelistUser,
  data: [
    {
      firstName: 'Nappa',
      lastName: 'Saiyan',
      uid: '113567',
    },
    {
      firstName: 'Vegeta',
      lastName: 'Saiyan',
      uid: '133766',
    },
    {
      firstName: 'Raditz',
      lastName: 'Saiyan',
      uid: '629990',
    },
  ]
};
