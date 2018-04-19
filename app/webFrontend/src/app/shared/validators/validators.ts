import {FormControl, FormGroup} from '@angular/forms';

export function matchPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const password = group.controls[passwordKey];
    const confirmPassword = group.controls[confirmPasswordKey];

    if (password.value !== confirmPassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  };
}

/**
 * A custom email validator which, in comparison to the default angular email validator,
 * also checks if the email address has a top-level domain.
 *
 * @param {FormControl} formControl
 * @returns {{emailValidator: {valid: boolean}}}
 */
export function emailValidator(formControl: FormControl) {
  // Email Regex from: http://emailregex.com/
  // tslint:disable-next-line:max-line-length
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EMAIL_REGEX.test(formControl.value) ? null : {
    emailValidator: {
      valid: false
    }
  };
}
