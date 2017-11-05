import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MatSnackBar} from '@angular/material';
import {matchPasswords} from '../../shared/validators/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registrationDone = false;
  role;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private showProgress: ShowProgressService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.unsetAuthData();
    this.role = 'student';
    this.generateForm();
  }

  changeRole(role) {
      this.role = role;
  }

  register() {
    this.showProgress.toggleLoadingGlobal(true);
    this.registerForm.value.role = this.role;
    if (this.registerForm.value.role !== 'student') {
      delete this.registerForm.value.uid;
    }
    this.registerForm.value.email = this.registerForm.value.email.replace(/\s/g, '').toLowerCase();
    this.authenticationService.register(this.registerForm.value).then(
      (val) => {
        this.showProgress.toggleLoadingGlobal(false);
        this.registrationDone = true;
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Registration failed', 'Dismiss');
      });
  }

  generateForm() {
    this.registerForm = this.formBuilder.group({
      role: ['', Validators.required],
      profile: this.formBuilder.group({
        firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      }),
      email: ['', Validators.compose([Validators.required, Validators.email])],
      uid: [null, Validators.required],
      /*
       *Regex for password validation:
       * (?=.*[a-zA-Z]) --> searchs for at least one uppercase or lowercase letter
       * (?=.*[$%&§=#!?*()|0-9]) --> searchs for at least one special character or digit
       * .{8,} ensures, that the password has 8 or more characters
       */
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[$%&§=#!?*()|0-9]).{8,}$')])],
      confirmPassword: ['', Validators.required]
    }, {validator: matchPasswords('password', 'confirmPassword')});
  }
}
