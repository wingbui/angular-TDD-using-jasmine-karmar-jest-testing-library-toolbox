import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { routes } from './router/app-router/app-router.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';

describe('Routing', () => {
  it.each`
    path        | pageId
    ${'/login'} | ${'login-page'}
    ${'/user'}  | ${'user-page'}
  `(`should navigate to the $pageId at $path`, async ({ path, pageId }) => {
    const { navigate } = await render(AppComponent, {
      declarations: [
        HomeComponent,
        LoginComponent,
        UserComponent,
        SignUpComponent,
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      routes: routes,
    });

    await navigate(path);
    expect(screen.getByTestId(pageId)).toBeInTheDocument();
  });

  it('should navigate to home page at /', async () => {
    const { navigate } = await render(AppComponent, {
      routes: routes,
    });

    await navigate('/');
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should navigate to sign-up page at /sign-up', async () => {
    const { navigate } = await render(AppComponent, {
      declarations: [HomeComponent, SignUpComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      routes: routes,
    });

    await navigate('/sign-up');
    expect(screen.getByTestId('sign-up-page')).toBeInTheDocument();
  });
});
