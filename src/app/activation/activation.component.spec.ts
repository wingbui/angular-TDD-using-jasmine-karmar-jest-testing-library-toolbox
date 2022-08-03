import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { Observable, Subscriber } from 'rxjs';

import { ActivationComponent } from './activation.component';
import { AlertComponent } from '../shared/modules/alert/components/alert/alert.component';

interface RouteParams {
  token: string;
}

describe('ActivationComponent', () => {
  let component: ActivationComponent;
  let fixture: ComponentFixture<ActivationComponent>;
  let httpController: HttpTestingController;
  let subscriber: Subscriber<RouteParams>;

  beforeEach(async () => {
    let observable = new Observable<RouteParams>((sub) => (subscriber = sub));

    await TestBed.configureTestingModule({
      declarations: [ActivationComponent, AlertComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: observable,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivationComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send activation request', () => {
    subscriber.next({ token: '123' });
    const requests = httpController.match('/api/1.0/users/activate/token/123');
    expect(requests.length).toBe(1);
  });

  it('should display success alert when token is valid', () => {
    subscriber.next({ token: '123' });
    const request = httpController.expectOne(
      '/api/1.0/users/activate/token/123'
    );
    request.flush({});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert').textContent).toContain(
      'Your account is activated'
    );
  });

  it('should display error alert when token is invalid', () => {
    subscriber.next({ token: '456' });
    const request = httpController.expectOne(
      '/api/1.0/users/activate/token/456'
    );
    request.flush({}, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.alert').textContent).toContain(
      'Your account activation failed'
    );
  });
});
