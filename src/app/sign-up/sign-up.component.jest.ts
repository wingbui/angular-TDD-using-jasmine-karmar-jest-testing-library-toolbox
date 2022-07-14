import { screen, render, getByRole } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import 'whatwg-fetch';

import { SignUpComponent } from './sign-up.component';

describe('Layout', () => {
  it('should have a header h1', async () => {
    await render(SignUpComponent);
    const h1 = screen.getByRole('heading', { name: 'Sign Up' });
    expect(h1).toBeInTheDocument();
  });

  it('should have a Username input', async () => {
    await render(SignUpComponent);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should have a Email input', async () => {
    await render(SignUpComponent);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should have a Password input', async () => {
    await render(SignUpComponent);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should have a password type for Password input', async () => {
    await render(SignUpComponent);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should have Sign Up button', async () => {
    await render(SignUpComponent);
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toBeInTheDocument();
  });

  it('should disable the button initially', async () => {
    await render(SignUpComponent);
    const button = screen.getByRole('button', { name: 'Sign Up' });

    expect(button).toBeDisabled();
  });
});

describe('Interaction', () => {
  it('it should enable the button when Password and Repeat Password match', async () => {
    await render(SignUpComponent);
    const inputPassword = screen.getByLabelText('Password');
    const inputPasswordRepeat = screen.getByLabelText('Password Repeat');
    const user = userEvent.setup();
    await user.type(inputPassword, 'p@ssword');
    await user.type(inputPasswordRepeat, 'p@ssword');

    const button = screen.getByRole('button', { name: 'Sign Up' });

    expect(button).toBeEnabled();
  });

  it('should send username, email and password to backend after clicking Sign Up button', async () => {
    const spy = jest.spyOn(window, 'fetch');

    await render(SignUpComponent);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const passwordRepeatInput = screen.getByLabelText('Password Repeat');

    const user = userEvent.setup();
    await user.type(usernameInput, 'username');
    await user.type(emailInput, 'email');
    await user.type(passwordInput, 'password');
    await user.type(passwordRepeatInput, 'password');

    const button = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(button);

    const args = spy.mock.calls[0];
    const secondParam = args[1];

    expect(secondParam?.body).toEqual(
      JSON.stringify({
        username: 'username',
        email: 'email',
        password: 'password',
      })
    );
  });
});
