import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { AuthenticationService } from '../../shared/authentification.service';
import {AuthGuardService} from "../../shared/auth-guard.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    loading = false;
    error = '';
    loginForm: FormGroup;

    constructor(
        private router: Router,
        private authGuard: AuthGuardService,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        this.generateForm();
    }

    login() {
        //this.loading = true;
        this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password).then(
            (val) => {
                if(this.authGuard.redirectUrl) {
                    this.router.navigate([this.authGuard.redirectUrl]);
                } else {
                    this.router.navigate(['/dashboard']);
                }

            }, (error) => {
                console.log('wrong credentials');
                console.log(error);
            });
    }

    generateForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
    }



}