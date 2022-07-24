import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './router/app-router/app-router.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
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

      const home = fixture.nativeElement as HTMLElement;
      expect(home.querySelector('[data-testid="home-page"]')).toBeTruthy();
    });
  });
});
