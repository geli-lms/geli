import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MdSnackBar} from '@angular/material';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  error = '';
  registerForm: FormGroup;

  message: string;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private showProgress: ShowProgressService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.generateForm();
  }

  register() {
    this.showProgress.toggleLoadingGlobal(true);
    this.authenticationService.register(this.registerForm.value.firstName,
      this.registerForm.value.lastName,
      this.registerForm.value.username,
      this.registerForm.value.email,
      this.registerForm.value.password).then(
      (val) => {
        console.log('register done...' + val);
        this.message = `We've sent an activation link to your email.`;
        this.showProgress.toggleLoadingGlobal(false);
        // window.location.href = '../';
      }, (error) => {
        console.log('registration failed');
        console.log(error);
        this.showProgress.toggleLoadingGlobal(false);
      });
  }

  generateForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

}
