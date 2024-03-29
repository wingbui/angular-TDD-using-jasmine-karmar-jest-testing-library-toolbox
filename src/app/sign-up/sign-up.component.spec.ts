import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
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
    let signUp: HTMLElement;

    const setup = async () => {
      httpTestingController = TestBed.inject(HttpTestingController);

      signUp = fixture.nativeElement as HTMLElement;

      await fixture.whenStable();

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

      emailInput.value = 'email@mail.com';
      emailInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('blur'));

      passwordInput.value = 'password';
      passwordInput.dispatchEvent(new Event('input'));

      passwordRepeatInput.value = 'password';
      passwordRepeatInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      button = signUp.querySelector('button');
    };

    it('should enable the button when form is valid', async () => {
      await setup();
      expect(button?.disabled).toBe(false);
    });

    it('should send username, email and password to backend after clicking Sign Up button', async () => {
      await setup();

      button?.click();

      const req = httpTestingController.expectOne('/api/1.0/users');
      const reqBody = req.request.body;

      expect(reqBody).toEqual({
        username: 'username',
        email: 'email@mail.com',
        password: 'password',
      });
    });

    it('should disable the Sign Up button when there is an ongoing api', async () => {
      await setup();
      button?.click();
      fixture.detectChanges();
      button?.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button?.disabled).toBe(true);
    });

    it('should display the Submitting... text after submitting the Sign Up form', async () => {
      await setup();
      expect(button?.textContent?.trim()).toBe('Sign Up');
      button?.click();
      fixture.detectChanges();
      expect(httpTestingController.expectOne('/api/1.0/users'));
      expect(button?.textContent?.trim()).toBe('Submitting...');
    });

    it('should display success alert after successfully registering', async () => {
      await setup();

      expect(signUp.querySelector('.alert-success')).toBeFalsy();

      button?.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});

      fixture.detectChanges();

      expect(signUp.querySelector('.alert-success')?.textContent).toContain(
        'Success! Activate email please'
      );
    });

    it('should hide the sign-up form after successfully registering', async () => {
      await setup();
      expect(
        signUp.querySelector('form[data-testid="sign-up-form"]')
      ).toBeTruthy();

      button?.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({});
      fixture.detectChanges();

      expect(
        signUp.querySelector('form[data-testid="sign-up-form"]')
      ).toBeFalsy();
    });

    it('should display error alert after failed registration', async () => {
      await setup();

      expect(
        signUp.querySelector('ul[data-testid="email-validation"]')?.textContent
      ).not.toContain('Email already in use');

      button?.click();

      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush(
        {
          validationErrors: { email: 'Email already in use' },
        },
        {
          status: 400,
          statusText: 'Bad Request',
        }
      );

      fixture.detectChanges();

      expect(
        signUp.querySelector('ul[data-testid="email-validation"]')?.textContent
      ).toContain('Email already in use');
    });
  });

  describe('Validation', () => {
    const testCases = [
      { field: 'email', value: '', error: 'Email is required' },
      { field: 'password', value: '', error: 'Password is required' },
      {
        field: 'password',
        value: '12345',
        error: 'Password should be 6 characters up',
      },
      {
        field: 'passwordRepeat',
        value: '',
        error: 'Password Repeat is required',
      },
      { field: 'passwordRepeat', value: '1245', error: 'Passwords mismatched' },
    ];

    testCases.forEach(({ field, value, error }) => {
      it(`should show the message ${error}`, () => {
        const signUp = fixture.nativeElement as HTMLElement;
        const input = signUp.querySelector(
          `input[id="${field}"]`
        ) as HTMLInputElement;

        expect(
          signUp.querySelector(`ul[data-testid="${field}-validation"]`)
        ).toBeNull();

        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(
          signUp.querySelector(`ul[data-testid="${field}-validation"]`)
            ?.textContent
        ).toContain(`${error}`);
      });
    });

    it('should validate username be required', () => {
      const control = component.form.get('username');
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
    });

    it('should show the message Username is required when username value is null', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      expect(
        signUp.querySelector(
          'ul[data-testid="username-validation"]'
        ) as HTMLElement
      ).toBeNull();

      const usernameInput = signUp.querySelector(
        'input[id="username"]'
      ) as HTMLInputElement;

      usernameInput.dispatchEvent(new Event('input'));
      usernameInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(
        signUp.querySelector('ul[data-testid="username-validation"]')
          ?.textContent
      ).toContain('Username is required');
    });

    it('should show the message Username should be 2 characters up', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      expect(
        signUp.querySelector(
          'ul[data-testid="username-validation"]'
        ) as HTMLElement
      ).toBeNull();

      const usernameInput = signUp.querySelector(
        'input[id="username"]'
      ) as HTMLInputElement;

      usernameInput.value = '1';
      usernameInput.dispatchEvent(new Event('input'));
      usernameInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(
        signUp.querySelector('ul[data-testid="username-validation"]')
          ?.textContent
      ).toContain('Username should be 2 characters up');
    });

    it('should show the message Invalid email', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const emailInput = signUp.querySelector(
        'input[id="email"]'
      ) as HTMLInputElement;

      expect(
        signUp.querySelector('ul[data-testid="email-validation"]')
      ).toBeNull();

      emailInput.value = 'wrong-format';
      emailInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(
        signUp.querySelector('ul[data-testid="email-validation"]')?.textContent
      ).toContain('Invalid Email');
    });

    it('should show the message Email already in use', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const signUp = fixture.nativeElement as HTMLElement;
      const emailInput = signUp.querySelector(
        'input[id="email"]'
      ) as HTMLInputElement;
      expect(
        signUp.querySelector('ul[data-testid="email-validation"]')
      ).toBeNull();

      emailInput.value = 'already-in-use-email@email.com';
      emailInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('blur'));

      const request = httpTestingController.expectOne(
        ({ url, method, body }) => {
          if (url === '/api/1.0/user/email' && method === 'POST') {
            return body.email === 'already-in-use-email@email.com';
          }
          return false;
        }
      );

      request.flush({});

      fixture.detectChanges();

      expect(
        signUp.querySelector('ul[data-testid="email-validation"]')?.textContent
      ).toContain('Email already in use');
    });
  });
});
