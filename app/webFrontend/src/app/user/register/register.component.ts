import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AuthenticationService } from '../../shared/authentification.service';
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
        this.authenticationService.register(this.registerForm.value.username,
                                            this.registerForm.value.password,
                                            this.registerForm.value.firstname,
                                            this.registerForm.value.lastname).then(
            (val) => {
                console.log('register done...' + val);
                // window.location.href = '../';
            }, (error) => {
                console.log('wrong credentials');
                console.log(error);
            });
    }

    generateForm() {
        this.registerForm = this.formBuilder.group({
            firstname : ['', Validators.required],
            lastname : ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

}
