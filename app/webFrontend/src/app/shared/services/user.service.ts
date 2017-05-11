import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {IUser} from '../../../../../../shared/models/IUser';
import {User} from '../../models/User';

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
}
