import {Injectable} from '@angular/core';

import {IUser} from '../../../../../../shared/models/IUser';
import {User} from '../../models/User';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ThemeService} from './theme.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const md5 = require('blueimp-md5');

@Injectable()
export class UserService {
    public user: User = null;
    private actualProfilePicturePath: BehaviorSubject<string> = new BehaviorSubject<string>('');
    data = this.actualProfilePicturePath.asObservable();

    constructor(private themeService: ThemeService) {
        const storedUser: IUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser) {
            this.user = new User(storedUser);
        }
    }

    setUser(user: IUser) {
        this.user = new User(user);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.themeService.setTheme(this.user.profile.theme);

        const newPath = this.checkNewProfilePicturePath(this.user.profile);
        this.updateProfilePicture(newPath);
    }

    updateProfilePicture(newPath: string) {
        this.actualProfilePicturePath.next(newPath);
    }

    checkNewProfilePicturePath(profile) {
      return profile && profile.picture ? profile.picture.path : '';
    }

    unsetUser() {
        this.user = null;
        localStorage.removeItem('user');
        this.themeService.setTheme('auto');
    }

    isStudent(): boolean {
        return this.user.role === 'student';
    }

    isTeacher(): boolean {
        return this.user.role === 'teacher';
    }

    isAdmin(): boolean {
        return this.user.role === 'admin';
    }

    isLoggedInUser(user: IUser): boolean {
        return this.user._id === user._id;
    }

    isCourseTeacherOrAdmin(course: ICourse) {
        if (this.isStudent()) {
            return false;
        }
        if (this.isAdmin()) {
            return true;
        }

        if (course.courseAdmin._id === this.user._id) {
            return true;
        }

        return (course.teachers.filter(teacher => teacher._id === this.user._id).length);
    }

    isMemberOfCourse(course: ICourse) {
        return course.students.filter(obj => obj._id === this.user._id).length > 0;
    }

    getActualProfilePicturePath() {
        return this.actualProfilePicturePath.getValue();
    }
}
