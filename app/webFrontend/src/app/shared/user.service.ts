import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthenticationService } from './authentification.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
    userName: string;
    userRole: string;

    constructor(){
    }


    isStudent(): boolean {
        return this.userRole === "student";
    }

    isTeacher(): boolean {
        return this.userRole === "teacher";
    }

    isAdmin(): boolean {
        return this.userRole === "admin";
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