import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    registerForm: FormGroup;

    message: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        this.generateForm();
    }

    register() {
        this.loading = true;
        this.authenticationService.register(this.registerForm.value.firstName,
                                            this.registerForm.value.lastName,
                                            this.registerForm.value.username,
                                            this.registerForm.value.email,
                                            this.registerForm.value.password).then(
            (val) => {
                console.log('register done...' + val);
                this.message = `We've sent an activation link to your email.`;
                // window.location.href = '../';
            }, (error) => {
                console.log('registration failed');
                console.log(error);
            });
    }

    generateForm() {
        this.registerForm = this.formBuilder.group({
            firstName : ['', Validators.required],
            lastName : ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

}
