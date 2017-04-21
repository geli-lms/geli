import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    userName: string;
    userRole: string;

    isStudent(): boolean {
        return this.userRole === 'student';
    }

    isTeacher(): boolean {
        return this.userRole === 'teacher';
    }

    isAdmin(): boolean {
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
}
