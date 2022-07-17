import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Layout', () => {
    it('should have a header h1 Sign Up', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const h1 = signUp.querySelector('h1');

      expect(h1?.textContent).toBe('Sign Up');
    });

    it('should have a label Username', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="username"]');

      expect(label?.textContent).toBe('Username');
    });

    it('should have a username input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="username"]');

      expect(input).toBeTruthy();
    });

    it('should have a label Email', () => {
      let signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="email"]');

      expect(label?.textContent).toBe('Email');
    });

    it('should have a email input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="email"]');

      expect(input).toBeTruthy();
    });

    it('should have a email placeholder', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector(
        'input[id="email"]'
      ) as HTMLInputElement;

      expect(input.placeholder).toBe('email');
    });

    it('should have a label Password', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="password"]');

      expect(label?.textContent).toBe('Password');
    });

    it('should have a password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="password"]');

      expect(input).toBeTruthy();
    });

    it('should have a password input type password', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector(
        'input[id="password"]'
      ) as HTMLInputElement;

      expect(input.type).toBe('password');
    });

    it('should have a label Password Repeat', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="passwordRepeat"]');

      expect(label?.textContent).toBe('Password Repeat');
    });

    it('should have a password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="password"]');

      expect(input).toBeTruthy();
    });

    it('should have a password repeat input type password', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector(
        'input[id="passwordRepeat"]'
      ) as HTMLInputElement;

      expect(input.type).toBe('password');
    });

    it('should have a Sign Up button', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');

      expect(button?.textContent?.trim()).toBe('Sign Up');
    });

    it('should disable the button initially', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');

      expect(button?.disabled).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    let button: HTMLButtonElement | null;
    let httpTestingController: HttpTestingController;

    const setup = () => {
      httpTestingController = TestBed.inject(HttpTestingController);

      const signUp = fixture.nativeElement as HTMLElement;
      const usernameInput = signUp.querySelector(
        'input[id="username"]'
      ) as HTMLInputElement;
      const emailInput = signUp.querySelector(
        'input[id="email"]'
      ) as HTMLInputElement;
      const passwordInput = signUp.querySelector(
        'input[id="password"]'
      ) as HTMLInputElement;
      const passwordRepeatInput = signUp.querySelector(
        'input[id="passwordRepeat"]'
      ) as HTMLInputElement;

      usernameInput.value = 'username';
      usernameInput.dispatchEvent(new Event('input'));

      emailInput.value = 'email';
      emailInput.dispatchEvent(new Event('input'));

      passwordInput.value = 'password';
      passwordInput.dispatchEvent(new Event('input'));

      passwordRepeatInput.value = 'password';
      passwordRepeatInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      button = signUp.querySelector('button');
    };

    it('should enable the button when Password and Repeat Password match', () => {
      setup();
      expect(button?.disabled).toBe(false);
    });

    it('should send username, email and password to backend after clicking Sign Up button', () => {
      setup();

      button?.click();

      const req = httpTestingController.expectOne('/api/1.0/users');
      const reqBody = req.request.body;

      expect(reqBody).toEqual({
        username: 'username',
        email: 'email',
        password: 'password',
      });
    });

    it('should disable the Sign Up button when there is an ongoing api', () => {
      setup();
      button?.click();
      fixture.detectChanges();
      button?.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button?.disabled).toBe(true);
    });

    it('should display the Submitting... text after submitting the Sign Up form', () => {
      setup();
      expect(button?.textContent?.trim()).toBe('Sign Up');
      button?.click();
      fixture.detectChanges();
      expect(httpTestingController.expectOne('/api/1.0/users'));
      expect(button?.textContent?.trim()).toBe('Submitting...');
    });
  });
});
