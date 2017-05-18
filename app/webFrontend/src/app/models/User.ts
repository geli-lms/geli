import {IUser} from '../../../../../shared/models/IUser';
import md5 from 'blueimp-md5';

export class User implements IUser {
  _id: any;
  uid: any;
  username: string;
  email: string;
  password: string;
  profile: { firstName: string; lastName: string; };
  role: string;

  constructor(user: IUser) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.profile = user.profile;
    this.role = user.role;
  }

  getGravatarURL(size: number = 80) {
    return 'https://www.gravatar.com/avatar/' + md5(this.email.toLowerCase()) + '.jpg?s=' + size;
  }
}
