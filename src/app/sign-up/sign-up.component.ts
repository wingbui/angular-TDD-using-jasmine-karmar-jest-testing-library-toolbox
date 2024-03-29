import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { passwordMatchValidator } from './validators/password-match-validator';
import { SignUpRequest } from './types/sign-up-request';
import { UniqueEmailValidator } from './validators/unique-email-validator';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  form = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [
          this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator),
        ],
        updateOn: 'blur',
      }),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      passwordRepeat: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  apiProgress = false;
  isSuccess = false;

  get passwordError() {
    const field = this.form.get('password');
    const errors = [];
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        errors.push('Password is required');
      }
      if (field.errors['minlength']) {
        errors.push('Password should be 6 characters up');
      }
    }
    return errors;
  }

  get passwordRepeatError() {
    const field = this.form.get('passwordRepeat');
    const errors = [];
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        errors.push('Password Repeat is required');
      }
    }
    if (this.form?.errors?.['passwordMatch'] && field?.touched) {
      errors.push('Passwords mismatched');
    }
    return errors;
  }

  constructor(
    private userService: UserService,
    private uniqueEmailValidator: UniqueEmailValidator
  ) {}

  ngOnInit(): void {}

  onClickSignUp() {
    this.apiProgress = true;
    let data: SignUpRequest = {
      username: this.form.get('username')?.value || '',
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || '',
    };

    this.userService.signUp(data).subscribe({
      next: () => {
        this.isSuccess = true;
      },
      error: (httpError: HttpErrorResponse) => {
        this.isSuccess = false;
        const emailValidationErrorMessage =
          httpError.error.validationErrors.email;
        this.form
          .get('email')
          ?.setErrors({ backend: emailValidationErrorMessage });
      },
    });
  }

  isDisabled(): boolean {
    const formFilled =
      this.form.get('username')?.value &&
      this.form.get('email')?.value &&
      this.form.get('password')?.value &&
      this.form.get('passwordRepeat')?.value;

    const validationError =
      this.passwordError.length || this.passwordRepeatError.length;
    return !formFilled || validationError ? true : false;
  }
}
