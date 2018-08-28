import {IUser} from '../../../../../shared/models/IUser';
import {IFile} from '../../../../../shared/models/IFile';

const md5 = require('blueimp-md5');

export class User implements IUser {
    _id: any;
    uid: any;
    email: string;
    password: string;
    profile: { firstName: string; lastName: string; picture: IFile; theme: string };
    role: string;
    progress: any;
    lastVisitedCourses: Array<string>;

    constructor(user: any) {
        this._id = user._id;
        this.uid = user.uid;
        this.email = user.email;
        this.profile = user.profile;
        this.role = user.role;
        this.progress = user.progress;
        this.lastVisitedCourses = user.lastVisitedCourses;
    }

    get hasUploadedProfilePicture() {
      return this.profile && this.profile.picture;
    }

    getGravatarURL(size: number = 80) {
        // Gravatar wants us to hash the email (for site to site consistency),
        // - see https://en.gravatar.com/site/implement/hash/ -
        // but we don't do that (anymore) for the sake of security & privacy.
        return `https://www.gravatar.com/avatar/${md5(this._id)}.jpg?s=${size}&d=retro`;
    }

    getUserImageURL(size: number = 80, apiPrefix: string = '/api/uploads/users/') {
        if (this.hasUploadedProfilePicture) {
            return apiPrefix + this.profile.picture.name;
        } else {
            return this.getGravatarURL(size);
        }
    }
}
