import { Component, OnInit,  Input} from '@angular/core';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {pwPattern} from '../../validators/password';
import {matchPasswords} from '../../validators/validators';


@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})

export class PasswordInputComponent implements OnInit {
  @Input() form: FormGroup;
  passwordPatternText: string;
  constructor() { }

  ngOnInit() {
    this.passwordPatternText = pwPattern.text;
    this.form.addControl('password', new FormControl('', Validators.compose(
      [Validators.required, Validators.pattern(pwPattern.pattern)])));
    this.form.addControl('confirmPassword', new FormControl('', Validators.required));
    this.form.setValidators(matchPasswords('password', 'confirmPassword'))
  }
}
