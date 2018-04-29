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

    gravatar: string;

    constructor(user: any) {
        this._id = user._id;
        this.uid = user.uid;
        this.email = user.email;
        this.profile = user.profile;
        this.role = user.role;
        this.progress = user.progress;
        this.lastVisitedCourses = user.lastVisitedCourses;

        this.gravatar = user.gravatar ? user.gravatar : md5(user.email.toLowerCase());
    }

    getGravatarURL(size: number = 80) {
        return `https://www.gravatar.com/avatar/${this.gravatar}.jpg?s=${size}&d=retro`;
    }

    getUserImageURL(size: number = 80) {
        if (this.profile && this.profile.picture) {
            return 'api/uploads/users/' + this.profile.picture.name;
        } else {
            return this.getGravatarURL(size);
        }
    }
}
