import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
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
      { path: '/user/2', pageId: 'user-page' },
      { path: '/activate/123', pageId: 'activation-page' },
      { path: '/activate/456', pageId: 'activation-page' },
    ];

    testCases.forEach((testCase) => {
      it(`should display ${testCase.pageId} page when path is "${testCase.path}"`, async () => {
        await router.navigate([testCase.path]);
        fixture.detectChanges();

        const app = fixture.nativeElement as HTMLElement;
        expect(
          app.querySelector(`[data-testid="${testCase.pageId}"`)
        ).toBeTruthy();
      });
    });

    it('should should display home page when path is  "/"', async () => {
      await router.navigate(['/']);
      fixture.detectChanges();

      const app = fixture.nativeElement as HTMLElement;
      expect(app.querySelector('[data-testid="home-page"]')).toBeTruthy();
    });

    it('should should display sign-up page when path is "/sign-up"', async () => {
      await router.navigate(['/sign-up']);
      fixture.detectChanges();

      const app = fixture.nativeElement as HTMLElement;
      expect(app.querySelector('[data-testid="sign-up-page"]')).toBeTruthy();
    });

    const testLinks = [
      { path: '/', title: 'Home' },
      { path: '/sign-up', title: 'Sign Up' },
      { path: '/login', title: 'Login' },
    ];

    testLinks.forEach((testLink) => {
      it(
        'should have a link with title ' +
          testLink.title +
          ' at ' +
          testLink.path,
        () => {
          const app = fixture.nativeElement as HTMLElement;
          const link = app.querySelector(
            `a[title="${testLink.title}"]`
          ) as HTMLAnchorElement;
          expect(link.pathname).toEqual(testLink.path);
        }
      );
    });

    const navigationTests = [
      {
        initialPath: '/',
        clickingTo: 'Sign Up',
        visiblePage: 'sign-up-page',
      },
      {
        initialPath: '/sign-up',
        clickingTo: 'Home',
        visiblePage: 'home-page',
      },
      {
        initialPath: '/',
        clickingTo: 'Login',
        visiblePage: 'login-page',
      },
      {
        initialPath: '/login',
        clickingTo: 'Home',
        visiblePage: 'home-page',
      },
    ];

    navigationTests.forEach((test) => {
      it(
        'should navigate to ' +
          test.clickingTo +
          ' page when ' +
          test.initialPath +
          ' is clicked',
        fakeAsync(async () => {
          await router.navigate([test.initialPath]);

          const app = fixture.nativeElement as HTMLElement;
          const link = app.querySelector(
            `a[title="${test.clickingTo}"]`
          ) as HTMLAnchorElement;
          link.click();
          tick();
          fixture.detectChanges();

          expect(
            app.querySelector('[data-testid="' + test.visiblePage + '"]')
          ).toBeTruthy();
        })
      );
    });
  });
});
