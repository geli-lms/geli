import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../shared/services/authentication.service';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MatSnackBar} from '@angular/material';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  error = '';
  loginForm: FormGroup;
  loading = false;

  constructor(private router: Router,
              private authGuard: AuthGuardService,
              private authenticationService: AuthenticationService,
              private showProgress: ShowProgressService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.generateForm();
  }

  login() {
    this.showProgress.toggleLoadingGlobal(true);
    this.loading = true;
    this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password).then(
      (val) => {
        if (this.authGuard.redirectUrl) {
          this.router.navigate([this.authGuard.redirectUrl]);
        } else {
          this.router.navigate(['/']);
        }
        this.showProgress.toggleLoadingGlobal(false);
        this.loading = false;
        this.snackBar.open('Login successful', 'Dismiss', {duration: 2000});
      }, (error) => {
        console.log(error);
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Login failed!', 'Dismiss');

        this.loading = false;
      });
  }

  generateForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
