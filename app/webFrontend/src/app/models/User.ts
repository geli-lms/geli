import {IUser} from '../../../../../shared/models/IUser';
import md5 from 'blueimp-md5';
import {IFile} from '../../../../../shared/models/IFile';

export class User implements IUser {
  _id: any;
  uid: any;
  email: string;
  password: string;
  profile: { firstName: string; lastName: string; picture: IFile };
  role: string;
  progress: any;
  lastVisitedCourses: Array<string>;

  constructor(user: IUser) {
    this._id = user._id;
    this.uid = user.uid;
    this.email = user.email;
    this.profile = user.profile;
    this.role = user.role;
    this.progress = user.progress;
    this.lastVisitedCourses = user.lastVisitedCourses;
  }

  getGravatarURL(size: number = 80) {
    return `https://www.gravatar.com/avatar/${md5(this.email.toLowerCase())}.jpg?s=${size}&d=retro`;
  }

  getUserImageURL(size: number = 80) {
    if (this.profile && this.profile.picture) {
      return 'api/uploads/users/' + this.profile.picture.name;
    } else {
      return this.getGravatarURL(size);
    }
  }
}
