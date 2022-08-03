import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home/home.component';
import { AppRouterModule } from './router/app-router/app-router.module';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { ActivationComponent } from './activation/activation.component';
import { AlertModule } from './shared/modules/alert/alert.module';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    HomeComponent,
    LoginComponent,
    UserComponent,
    ActivationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AppRouterModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
