import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { SignUpComponent } from '../../sign-up/sign-up.component';
import { LoginComponent } from '../../login/login.component';
import { UserComponent } from '../../user/user.component';
import { ActivationComponent } from '../../activation/activation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'activate/:token', component: ActivationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouterModule {}
