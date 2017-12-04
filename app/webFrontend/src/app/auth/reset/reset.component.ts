import {Component, OnInit} from '@angular/core';

import {AuthenticationService} from '../../shared/services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {TitleService} from '../../shared/services/title.service';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})

export class ResetComponent implements OnInit {
  error = '';
  resetForm: FormGroup;
  loading = false;

  token;
  hasToken = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private showProgress: ShowProgressService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private titleService: TitleService) {
    this.route.params.subscribe(params => {
      if (!isNullOrUndefined(params['token'])) {
        this.token = params['token'];
        this.hasToken = true;
      }
      this.generateForm();
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Reset Password');
    this.generateForm();
  }

  requestReset() {
    this.showProgress.toggleLoadingGlobal(true);
    this.loading = true;
    this.authenticationService.requestReset(this.resetForm.value.email.replace(/\s/g, '').toLowerCase())
    .then(
      (val) => {
        this.snackBar.open('Check your mails', 'Dismiss');
      }, (error) => {
        this.snackBar.open('Request failed', 'Dismiss');
      })
    .then(() => {
      this.showProgress.toggleLoadingGlobal(false);
      this.loading = false;
    });
  }

  reset() {
    this.showProgress.toggleLoadingGlobal(true);
    this.loading = true;
    this.authenticationService.resetPassword(this.token, this.resetForm.value.password)
    .then(
      (val) => {
        this.router.navigate(['/login']);
        this.snackBar.open('Your password has been reset', 'Dismiss');
      }, (error) => {
        this.snackBar.open('Your password could not be reset', 'Dismiss');
      })
    .then(() => {
      this.showProgress.toggleLoadingGlobal(false);
      this.loading = false;
    });
  }

  generateForm() {
    if (this.hasToken) {
      this.resetForm = this.formBuilder.group({});
    } else {
      this.resetForm = this.formBuilder.group({
        email: ['', Validators.required]
      });
    }
  }
}
