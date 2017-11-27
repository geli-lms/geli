import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MatSnackBar} from '@angular/material';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';
import {TitleService} from '../../shared/services/title.service';

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
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Register');
    // reset login status
    this.authenticationService.unsetAuthData();
    this.generateForm();
  }

  changeRole(role) {
    this.role = role;
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
      .catch((error) => {
        const errormessage = error.json().message || error.json().errmsg;
        switch (errormessage) {
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
            this.snackBar.open('Registration failed', 'Dismiss');
          }
        }
      })
      .then(() => {
        this.loading = false;
        this.showProgress.toggleLoadingGlobal(this.loading);
      })
    ;
  }

  generateForm() {
    this.registerForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      }),
      email: ['', Validators.compose([Validators.required, Validators.email])],
      uid: [null, Validators.required],
    })
  }
}
