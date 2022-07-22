import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { rest } from 'msw';
import { screen, render, waitFor, fireEvent } from '@testing-library/angular';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

import { SignUpComponent } from './sign-up.component';
import { SignUpRequest } from './types/sign-up-request';

type UniqueEmailCheck = {
  email: string;
};

let reqBody: SignUpRequest;
let count = 0;
const server = setupServer(
  rest.post('/api/1.0/users', (req, res, ctx) => {
    count++;
    reqBody = req.body as SignUpRequest;
    return res(ctx.status(201), ctx.json({}));
  }),
  rest.post('/api/1.0/user/email', (req, res, ctx) => {
    let body = req.body as UniqueEmailCheck;

    if (body.email === 'non-unique-email@email.com') {
      return res(ctx.status(200), ctx.json({}));
    } else {
      return res(ctx.status(404), ctx.json({}));
    }
  })
);

beforeEach(() => {
  count = 0;
  server.resetHandlers();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

const setup = async () => {
  await render(SignUpComponent, {
    imports: [HttpClientModule, ReactiveFormsModule],
  });
};

describe('SignUpComponent', () => {
  describe('Layout', () => {
    it('should have a header h1', async () => {
      await setup();
      expect(
        screen.getByRole('heading', { name: 'Sign Up' })
      ).toBeInTheDocument();
    });

    it('should have a Username input', async () => {
      await setup();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should have a Email input', async () => {
      await setup();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should have a Password input', async () => {
      await setup();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should have a password type for Password input', async () => {
      await setup();
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password'
      );
    });

    it('should have Sign Up button', async () => {
      await setup();
      expect(
        screen.getByRole('button', { name: 'Sign Up' })
      ).toBeInTheDocument();
    });

    it('should disable the button initially', async () => {
      await setup();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    let button: HTMLButtonElement;
    const setupForm = async () => {
      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const passwordRepeatInput = screen.getByLabelText('Password Repeat');

      const user = userEvent;
      await user.type(usernameInput, 'username');
      await user.type(emailInput, 'email');
      await user.type(passwordInput, 'password');
      await user.type(passwordRepeatInput, 'password');

      button = screen.getByRole('button', { name: 'Sign Up' });
    };

    it('should enable the button when form is valid', async () => {
      await setup();
      await setupForm();

      expect(button).toBeEnabled();
    });

    it('should send username, email and password to backend after clicking Sign Up button', async () => {
      await setup();
      await setupForm();

      await userEvent.click(button);

      await waitFor(() => {
        expect(reqBody).toEqual({
          username: 'username',
          email: 'email',
          password: 'password',
        });
      });
    });

    it('should disable the Sign Up button when there is an ongoing api', async () => {
      await setup();
      await setupForm();

      await userEvent.click(button);
      await userEvent.click(button);

      await waitFor(() => {
        expect(count).toBe(1);
      });
    });

    it('should display the Submitting... text after submitting', async () => {
      await setup();
      await setupForm();
      expect(button.textContent?.trim()).toBe('Sign Up');

      await userEvent.click(button);

      await waitFor(() => {
        expect(button.textContent?.trim()).toBe('Submitting...');
      });
    });

    it('should display the Submitting element after clicking submit', async () => {
      await setup();
      await setupForm();

      expect(
        screen.queryByRole('status', { hidden: true })
      ).not.toBeInTheDocument();

      await userEvent.click(button);

      expect(
        screen.queryByRole('status', { hidden: true })
      ).toBeInTheDocument();
    });

    it('should display success alert after successfully registering', async () => {
      await setup();
      await setupForm();

      expect(
        screen.queryByText('Success! Activate email please')
      ).not.toBeInTheDocument();

      await userEvent.click(button);

      expect(
        await screen.findByText('Success! Activate email please')
      ).toBeInTheDocument();
    });

    it('should hide the sign-up form after successfully registering', async () => {
      await setup();
      await setupForm();

      const form = screen.getByTestId('sign-up-form');

      await userEvent.click(button);

      expect(form).toBeInTheDocument();
    });

    it('should display error alert after fail registration unique email validation', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { email: 'Email already in use' },
            })
          );
        })
      );
      await setup();
      await setupForm();

      const user = userEvent;
      await user.click(button);

      expect(
        await screen.findByText('Email already in use')
      ).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it.each`
      label                | inputValue                      | message
      ${'Email'}           | ${'{space}{backspace}'}         | ${'Email is required'}
      ${'Email'}           | ${'non-unique-email@email.com'} | ${'Email already in use'}
      ${'Password Repeat'} | ${'{space}{backspace}'}         | ${'Password Repeat is required'}
      ${'Password Repeat'} | ${'123'}                        | ${'Passwords mismatched'}
    `(
      'should show $message when $label has $inputValue ',
      async ({ label, inputValue, message }) => {
        await setup();
        expect(screen.queryByText(message)).not.toBeInTheDocument();
        const input = screen.getByLabelText(label);

        const user = userEvent;
        await user.type(input, inputValue);
        await user.tab();

        let errorMessage = await screen.findByText(message);
        expect(errorMessage).toBeInTheDocument();
      }
    );

    it('should show the message Username is required when username value is null', async () => {
      await setup();
      const message = 'Username is required';
      expect(screen.queryByText(message)).not.toBeInTheDocument();

      const usernameInput = screen.getByLabelText('Username') as HTMLElement;

      const user = userEvent;
      await user.click(usernameInput);
      await user.tab();

      // alternative way for userEvent
      // fireEvent.focus(usernameInput)
      // fireEvent.blur(usernameInput)

      expect(screen.queryByText(message)).toBeInTheDocument();
    });

    it('should show the message Username should be 2 characters up', async () => {
      await setup();
      const message = 'Username should be 2 characters up';
      expect(screen.queryByText(message)).not.toBeInTheDocument();

      const usernameInput = screen.getByLabelText('Username') as HTMLElement;

      const user = userEvent;
      await user.type(usernameInput, '1');
      await user.tab();

      expect(screen.queryByText(message)).toBeInTheDocument();
    });
  });
});
