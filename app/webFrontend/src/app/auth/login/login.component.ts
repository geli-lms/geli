import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../shared/services/authentication.service';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MatSnackBar} from '@angular/material';
import {TitleService} from '../../shared/services/title.service';
import {TranslateService} from '@ngx-translate/core';

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
              private formBuilder: FormBuilder,
              private titleService: TitleService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Login');
    // reset login status
    this.authenticationService.logout();
    this.generateForm();
  }

  login() {
    this.showProgress.toggleLoadingGlobal(true);
    this.loading = true;
    this.loginForm.value.email = this.loginForm.value.email.replace(/\s/g, '').toLowerCase();
    this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password).then(
      () => {
        this.router.navigate(['/']);
        this.showProgress.toggleLoadingGlobal(false);
        this.loading = false;

        this.translate.get(['auth.loginSuccess', 'common.dismiss']).subscribe((t: string) => {
          this.snackBar.open(t['auth.loginSuccess'], t['common.dismiss'], {duration: 2000});
        });
      })
      .catch(error => {
        this.showProgress.toggleLoadingGlobal(false);
        this.loading = false;

        this.translate.get(['auth.loginFailed', 'common.dismiss']).subscribe((t: string) => {
          this.snackBar.open(t['auth.loginFailed'], t['common.dismiss'], {duration: 2000});
        });
      });
  }

  generateForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
