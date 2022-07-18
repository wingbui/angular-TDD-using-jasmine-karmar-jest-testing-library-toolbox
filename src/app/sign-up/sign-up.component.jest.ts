import { HttpClientModule } from '@angular/common/http';
import { rest } from 'msw';
import { screen, render, waitFor } from '@testing-library/angular';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

import { SignUpComponent } from './sign-up.component';
import { SignUpRequest } from './types/sign-up-request';

let reqBody: SignUpRequest;
let count = 0;
const server = setupServer(
  rest.post('/api/1.0/users', (req, res, ctx) => {
    count++;
    reqBody = req.body as SignUpRequest;
    return res(ctx.status(201), ctx.json({}));
  })
);

beforeEach(() => {
  count = 0;
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

const setup = async () => {
  await render(SignUpComponent, {
    imports: [HttpClientModule],
  });
};

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
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
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
  it('should enable the button when Password and Repeat Password match', async () => {
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

  it('should display the Submitting... text after submitting the Sign Up form', async () => {
    await setup();
    await setupForm();
    expect(button.textContent?.trim()).toBe('Sign Up');

    await userEvent.click(button);
    await waitFor(() => {
      expect(button.textContent?.trim()).toBe('Submitting...');
    });
  });
});
