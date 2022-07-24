import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './router/app-router/app-router.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    it('should navigate to home page at /', async () => {
      await router.navigate(['/']);
      fixture.detectChanges();

      const app = fixture.nativeElement as HTMLElement;
      expect(app.querySelector('[data-testid="home-page"]')).toBeTruthy();
    });

    it('should show sign-up page at /sign-up', async () => {
      await router.navigate(['/sign-up']);
      fixture.detectChanges();

      const app = fixture.nativeElement as HTMLElement;
      expect(app.querySelector('[data-testid="sign-up-page"]')).toBeTruthy();
    });
  });
});
