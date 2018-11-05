import {Component, OnInit} from '@angular/core';

import {AuthenticationService} from '../../shared/services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {TitleService} from '../../shared/services/title.service';
import {emailValidator} from '../../shared/validators/validators';
import {TranslateService} from '@ngx-translate/core';

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
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private titleService: TitleService,
              public translate: TranslateService) {
    this.route.params.subscribe(params => {
      if (!isNullOrUndefined(params['token'])) {
        this.token = params['token'];
        this.hasToken = true;
      }
      this.generateForm();
    });
  }

  ngOnInit() {
    this.translate.get('reset.resetPw').subscribe((t: string) => {
      this.titleService.setTitle(t['reset.resetPw']);
    });
    this.generateForm();
  }

  requestReset() {
    if (!this.resetForm.valid) {
      this.translate.get('reset.emailNotValid').subscribe((t: string) => {
        this.titleService.setTitle(t['reset.emailNotValid']);
      });
      return;
    }

    this.showProgress.toggleLoadingGlobal(true);
    this.loading = true;
    this.authenticationService.requestReset(this.resetForm.value.email.replace(/\s/g, '').toLowerCase())
    .then(
      (val) => {
        this.translate.get('reset.checkMails').subscribe((t: string) => {
          this.titleService.setTitle(t['reset.checkMails']);
        });
      }, (error) => {
        this.translate.get('reset.requestFailed').subscribe((t: string) => {
          this.titleService.setTitle(t['reset.requestFailed']);
        });
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
        this.translate.get('reset.success').subscribe((t: string) => {
          this.titleService.setTitle(t['reset.success']);
        });
      }, (error) => {
        this.translate.get('reset.failed').subscribe((t: string) => {
          this.titleService.setTitle(t['reset.failed']);
        });
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
        email: ['', emailValidator ]
      });
    }
  }
}
