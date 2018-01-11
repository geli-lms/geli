import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {IUser} from '../../../../../../shared/models/IUser';
import {User} from '../../models/User';
import {ICourse} from '../../../../../../shared/models/ICourse';

@Injectable()
export class UserService {
  public user: User = null;

  constructor() {
    const storedUser: IUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      this.user = new User(storedUser);
    }
  }

  setUser(user: IUser) {
    this.user = new User(user);
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  unsetUser() {
    this.user = null;
    localStorage.removeItem('user');
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

    return ( course.teachers.filter(teacher => teacher._id === this.user._id).length)
  }

  isMemberOfCourse(course: ICourse) {
    return course.students.filter(obj => obj._id === this.user._id).length > 0;
  }
}
