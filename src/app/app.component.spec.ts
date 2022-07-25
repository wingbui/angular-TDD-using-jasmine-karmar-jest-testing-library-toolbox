import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { routes } from './router/app-router/app-router.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, HomeComponent, SignUpComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have as title "Angular TDD"', () => {
    expect(component.title).toEqual('Angular TDD');
  });

  describe('Routing', () => {
    const testCases = [
      { path: '/login', pageId: 'login-page' },
      { path: '/user/1', pageId: 'user-page' },
      { path: '/user/2', pageId: 'user-page' },
    ];

    testCases.forEach((testCase) => {
      it(`should navigate to ${testCase.pageId} page at path "${testCase.path}"`, async () => {
        await router.navigate([testCase.path]);
        fixture.detectChanges();

        const app = fixture.nativeElement as HTMLElement;
        expect(
          app.querySelector(`[data-testid="${testCase.pageId}"`)
        ).toBeTruthy();
      });
    });

    it('should navigate to home page at path "/"', async () => {
      await router.navigate(['/']);
      fixture.detectChanges();

      const app = fixture.nativeElement as HTMLElement;
      expect(app.querySelector('[data-testid="home-page"]')).toBeTruthy();
    });

    it('should should navigate to sign-up page at path "/sign-up"', async () => {
      await router.navigate(['/sign-up']);
      fixture.detectChanges();

      const app = fixture.nativeElement as HTMLElement;
      expect(app.querySelector('[data-testid="sign-up-page"]')).toBeTruthy();
    });
  });
});
