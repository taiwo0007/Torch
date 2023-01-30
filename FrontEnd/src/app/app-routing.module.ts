import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent} from './home/components/home/home.component';
import {LoginComponent} from "./auth/components/login/login.component";
import {SignupComponent} from "./auth/components/signup/signup.component";
import {UserProfileComponent} from "./user/components/user-profile/user-profile.component";
import {EscooterResultsComponent} from "./escooter/components/escooter-results/escooter-results.component";
import {EscooterDetailComponent} from "./escooter/components/escooter-detail/escooter-detail.component";
import {EscoooterBookingComponent} from "./escooter/components/escoooter-booking/escoooter-booking.component";
import {ErrorComponent} from "./shared/components/error/error.component";
import {TripComponent} from "./trip/components/trip/trip.component";
import {UserTripsComponent} from "./trip/components/user-trips/user-trips.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'error', component: ErrorComponent},

  {path: 'profile', component: UserProfileComponent},
  {path: 'results', component: EscooterResultsComponent},
  {path: 'escooter-detail/:id', component: EscooterDetailComponent},
  {path: 'escooter-booking/:id', component: EscoooterBookingComponent},

  {path: 'trip-detail/:id', component: TripComponent},
  {path: 'user-trips', component: UserTripsComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
