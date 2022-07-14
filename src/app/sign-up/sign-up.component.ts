import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  username = '';
  email = '';
  password: string = '';
  passwordRepeat: string = '';

  constructor() {}

  ngOnInit(): void {}

  onChangeUsername(event: Event) {
    this.username = (event.target as HTMLInputElement)?.value;
  }

  onChangeEmail(event: Event) {
    this.email = (event.target as HTMLInputElement)?.value;
  }

  onChangePassword(event: Event) {
    this.password = (event.target as HTMLInputElement)?.value;
  }

  onChangePasswordRepeat(event: Event) {
    this.passwordRepeat = (event.target as HTMLInputElement)?.value;
  }

  onClickSignUp() {
    console.log('click');
    fetch('/api/v1/signUp', {
      method: 'POST',
      body: JSON.stringify({
        username: this.username,
        email: this.email,
        password: this.password,
      }),
      headers: { 'Content-type': 'application/json' },
    });
  }

  isDisabled(): boolean {
    return this.password ? this.password !== this.passwordRepeat : true;
  }
}
