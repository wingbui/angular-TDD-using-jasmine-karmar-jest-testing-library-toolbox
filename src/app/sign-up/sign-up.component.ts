import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    password: new FormControl(''),
    passwordRepeat: new FormControl(''),
  });
  apiProgress = false;
  isSuccess = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onClickSignUp() {
    this.apiProgress = true;
    this.http
      .post('/api/1.0/users', {
        username: this.form.get('username')?.value,
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      })
      .subscribe(() => {
        this.isSuccess = true;
      });
  }

  isDisabled(): boolean {
    return this.form.get('password')?.value
      ? this.form.get('password')?.value !==
          this.form.get('passwordRepeat')?.value
      : true;
  }
}
