import { HttpClientModule } from '@angular/common/http';
import { render, screen, waitFor } from '@testing-library/angular';
import { Observable, Subscriber } from 'rxjs';
import { rest } from 'msw';
import { setupServer } from 'msw/lib/node';

import { AlertComponent } from '../shared/modules/alert/components/alert/alert.component';
import { ActivationComponent } from './activation.component';
import { ActivatedRoute } from '@angular/router';

let counter = 0;
const server = setupServer(
  rest.post('/api/1.0/users/activate/token/:token', (req, res, ctx) => {
    counter++;
    if (req.params['token'] === '456') {
      return res(ctx.status(400), ctx.json({}));
    }
    return res(ctx.status(200), ctx.json({}));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

interface RouteParams {
  token: string;
}

let subscriber: Subscriber<RouteParams>;

const setup = async () => {
  const observable = new Observable<RouteParams>((sub) => (subscriber = sub));
  await render(ActivationComponent, {
    declarations: [AlertComponent],
    imports: [HttpClientModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: observable,
        },
      },
    ],
  });
};

describe('ActivationComponent', () => {
  it('should send activation request', async () => {
    await setup();
    subscriber.next({ token: '123' });

    await waitFor(() => {
      expect(counter).toBe(1);
    });
  });

  it('should display success alert when token is valid', async () => {
    await setup();
    subscriber.next({ token: '123' });

    const message = await screen.findByText('Your account is activated');
    expect(message).toBeInTheDocument();
  });

  it('should display error alert when token is invalid', async () => {
    await setup();
    subscriber.next({ token: '456' });

    const message = await screen.findByText('Your account activation failed');
    expect(message).toBeInTheDocument();
  });

  it('should display Loading... when activation is in progress', async () => {
    await setup();
    subscriber.next({ token: '456' });
    const message = await screen.findByText('Loading...');
    expect(
      await screen.findByText('Your account activation failed')
    ).toBeInTheDocument();
    expect(message).not.toBeInTheDocument();
  });
});
