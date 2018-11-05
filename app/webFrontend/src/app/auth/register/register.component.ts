import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';
import {TitleService} from '../../shared/services/title.service';
import {APIInfoService} from '../../shared/services/data.service';
import {emailValidator} from '../../shared/validators/validators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registrationDone = false;
  role = 'student';
  loading = false;
  uidError = null;
  mailError = null;
  teacherMailRegex: string;

  private trimFormFields() {
    this.registerForm.value.email = this.registerForm.value.email.trim();
    this.registerForm.value.profile.firstName = this.registerForm.value.profile.firstName.trim();
    this.registerForm.value.profile.lastName = this.registerForm.value.profile.lastName.trim();
    if (this.registerForm.value.uid) {
      this.registerForm.value.uid = this.registerForm.value.uid.trim();
    }
  }

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private showProgress: ShowProgressService,
              private snackBar: SnackBarService,
              private formBuilder: FormBuilder,
              private titleService: TitleService,
              private apiInfoService: APIInfoService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.apiInfoService.readAPIInfo().then((apiInfo: any) => {
        this.teacherMailRegex = apiInfo.teacherMailRegex;
      }
    );
    this.translate.get('registration.register').subscribe((t: string) => {
      this.titleService.setTitle('register...');
    });
    // reset login status
    this.authenticationService.unsetAuthData();
    this.generateForm();
  }

  changeRole(role) {
    this.role = role;
    this.registerForm.controls.email.updateValueAndValidity();
    this.registerForm.controls.uid.updateValueAndValidity();
  }

  clearAllErrors() {
    this.mailError = null;
    this.uidError = null;
  }

  register() {
    this.clearAllErrors();
    this.loading = true;
    this.showProgress.toggleLoadingGlobal(this.loading);
    this.registerForm.value.role = this.role;
    if (this.registerForm.value.role !== 'student') {
      delete this.registerForm.value.uid;
    }
    this.registerForm.value.email = this.registerForm.value.email.replace(/\s/g, '').toLowerCase();
    this.trimFormFields();
    this.authenticationService.register(this.registerForm.value).then(
      (val) => {
        this.registrationDone = true;
      })
      .catch((err) => {
        this.handleError(err);
      })
      .then(() => {
        this.loading = false;
        this.showProgress.toggleLoadingGlobal(this.loading);
      });
  }

  private handleError(err) {
    switch (err.error.message) {
      case errorCodes.mail.duplicate.code: {
        this.mailError = errorCodes.mail.duplicate.text;
        break;
      }
      case errorCodes.mail.noTeacher.code: {
        this.mailError = errorCodes.mail.noTeacher.text;
        break;
      }
      case errorCodes.duplicateUid.code: {
        this.uidError = errorCodes.duplicateUid.text;
        break;
      }
      default: {
        this.translate.get('registration.failed').subscribe((t: string) => {
          this.titleService.setTitle(t['registration.failed']);
        });
      }
    }
  }

  generateForm() {
    this.registerForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        firstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)])],
        lastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)])],
      }),
      email: ['', Validators.compose([emailValidator, Validators.required, this.validateTeacherEmail.bind(this)])],
      uid: ['', [this.validateMatriculationNumber.bind(this)]],
      privacyCheckbox: [false, Validators.requiredTrue],
      termsCheckbox: [false, Validators.requiredTrue]
    });
  }

  validateTeacherEmail(control: FormControl) {
    if (this.role === 'teacher' && !(control.value as String).match(this.teacherMailRegex)) {
      return {teacherEmailError: true};
    }
    return null;
  }

  validateMatriculationNumber(control: FormControl) {
    if (this.role === 'student' && (control.value as String).length <= 0) {
      return {uidValidator: true};
    }
    return null;
  }
}


