import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { Observable, Subscriber } from 'rxjs';

import { ActivationComponent } from './activation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../router/app-router/app-router.module';

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
      declarations: [ActivationComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
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
});
