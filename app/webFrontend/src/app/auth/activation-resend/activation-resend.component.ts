import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';
import {TitleService} from '../../shared/services/title.service';
import {emailValidator} from '../../shared/validators/validators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-activation-resend',
  templateUrl: './activation-resend.component.html',
  styleUrls: ['./activation-resend.component.scss']
})
export class ActivationResendComponent implements OnInit {
  resendActivationForm: FormGroup;
  resendActivationDone = false;
  loading = false;
  uidError = null;
  mailError = null;
  formError = null;

  private trimFormFields() {

    this.resendActivationForm.value.profile.lastName = this.resendActivationForm.value.profile.lastName.trim();
    this.resendActivationForm.value.uid = this.resendActivationForm.value.uid.trim();
    this.resendActivationForm.value.email = this.resendActivationForm.value.email.trim();

  }

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private showProgress: ShowProgressService,
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder,
              private titleService: TitleService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Resend Activation');
    // reset login status
    this.authenticationService.unsetAuthData();
    this.generateForm();
  }

  clearAllErrors() {
    this.mailError = null;
    this.uidError = null;
    this.formError = null;
  }

  check() {
    this.trimFormFields();
  }

  async resendActivation() {
    this.clearAllErrors();
    this.loading = true;
    this.showProgress.toggleLoadingGlobal(this.loading);
    this.resendActivationForm.value.email = this.resendActivationForm.value.email.replace(/\s/g, '').toLowerCase();
    this.trimFormFields();
    try {
     await this.authenticationService.resendActivation(this.resendActivationForm.value.profile.lastName,
       this.resendActivationForm.value.uid, this.resendActivationForm.value.email);
     this.resendActivationDone = true;
    } catch (err) {
      this.handleError(err);
    }
    this.loading = false;
    this.showProgress.toggleLoadingGlobal(this.loading);

  }

  private handleError(err) {
    switch (err.error.message) {
      case errorCodes.mail.duplicate.code: {
        this.mailError = errorCodes.mail.duplicate.text;
        break;
      }
      case errorCodes.user.userNotFound.code: {
        this.formError = errorCodes.user.userNotFound.text;
        break;
      }
      case errorCodes.user.userAlreadyActive.code: {
        this.formError = errorCodes.user.userAlreadyActive.text;
        break;
      }
      case errorCodes.user.retryAfter.code: {
        const timeTillNextTry = err.headers.get('retry-after');
        const timeTillNextTrySec = timeTillNextTry % 60;
        const timeTillNextTryMin = (timeTillNextTry / 60);
        this.formError = errorCodes.user.retryAfter.text + Math.floor(timeTillNextTryMin) + ' min '
          + Math.floor(timeTillNextTrySec) + ' sec.';
        break;
      }
      default: {
        this.translate.get('activation.text.activating').subscribe((t: string) => {
          this.snackBar.open(t['activation.text.resendFailed']);
        });
      }
    }
  }

  generateForm() {
    this.resendActivationForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      }),
      uid: ['', Validators.compose([Validators.required, this.validateMatriculationNumber.bind(this)])],
      email: ['', Validators.compose([Validators.required, emailValidator])]
    });
  }


  validateMatriculationNumber(control: FormControl) {
    if ((control.value as String).length <= 0) {
      return {uidValidator: true};
    }
    return null;
  }
}


