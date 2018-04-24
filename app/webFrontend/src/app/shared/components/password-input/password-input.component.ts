import { Component, OnInit,  Input} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import {matchPasswords} from '../../validators/validators';
import {errorCodes} from '../../../../../../../api/src/config/errorCodes';


@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})

export class PasswordInputComponent implements OnInit {
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
    this.form.addControl('password', new FormControl('', Validators.compose(
      [Validators.required, Validators.pattern(errorCodes.password.regex.regex)])));
    this.form.addControl('confirmPassword', new FormControl('', Validators.required));
    this.form.setValidators(matchPasswords('password', 'confirmPassword'));
  }
}
