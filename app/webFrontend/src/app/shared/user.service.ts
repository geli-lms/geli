import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class UserService {
    userName: string;
    userRole: string;
    token: string;

    constructor(private jwtHelper: JwtHelper) {
        this.getCurrentUserName();
        this.getCurrentUserRole();
    }

    isStudent(): boolean {
        return this.userRole === 'student';
    }

    isTeacher(): boolean {
        return this.userRole === 'teacher';
    }

    isAdmin(): boolean {
        this.getCurrentUserRole();
        return this.userRole === 'admin';
    }

    getCurrentUserRole(): string {
        this.userRole = localStorage.getItem('currentUserRole');
        return this.userRole;
    }

    getCurrentUserName(): string {
        this.userName = localStorage.getItem('currentUser');
        return this.userName;
    }

    getCurrentToken(): string {
      this.token = localStorage.getItem('currentUserToken');
      return this.token;
    }

    getCurrentUserId(): string {
      const token = this.getCurrentToken();
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken._id;
    }
}
