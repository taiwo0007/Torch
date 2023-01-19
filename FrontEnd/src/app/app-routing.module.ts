import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent} from './home/components/home/home.component';
import {LoginComponent} from "./auth/components/login/login.component";
import {SignupComponent} from "./auth/components/signup/signup.component";
import {UserProfileComponent} from "./user/components/user-profile/user-profile.component";
import {EscooterResultsComponent} from "./escooter/components/escooter-results/escooter-results.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},

  {path: 'profile', component: UserProfileComponent},
  {path: 'results', component: EscooterResultsComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
