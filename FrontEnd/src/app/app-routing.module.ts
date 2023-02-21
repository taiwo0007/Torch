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
import {TripHostsComponent} from "./trip/components/trip-hosts/trip-hosts.component";
import { AuthGuardService } from './auth/services/auth-guard.service';
import {HostEscootersComponent} from "./host/components/host-escooters/host-escooters.component";
import {HostEscooterAddComponent} from "./host/components/host-escooter-add/host-escooter-add.component";
import {BecomeHostComponent} from "./host/components/become-host/become-host.component";
import {HostProfileComponent} from "./host/components/host-profile/host-profile.component";
import {VerificationComponent} from "./auth/components/verification/verification.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'error', component: ErrorComponent},

  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuardService]},
  {path: 'results', component: EscooterResultsComponent},
  {path: 'escooter-detail/:id', component: EscooterDetailComponent},
  {path: 'escooter-booking/:id', component: EscoooterBookingComponent, canActivate: [AuthGuardService]},

  {path: 'trip-detail/:id', component: TripComponent, canActivate: [AuthGuardService]},
  {path: 'user-trips', component: UserTripsComponent, canActivate: [AuthGuardService]},
  {path: 'host-trips', component: TripHostsComponent, canActivate: [AuthGuardService]},
  {path: 'host-escooters/:id', component: HostEscootersComponent},
  {path: 'add-escooter', component: HostEscooterAddComponent, canActivate: [AuthGuardService]},
  {path: 'become-host', component: BecomeHostComponent},
  {path: 'host-profile/:id', component: HostProfileComponent},

  {path: 'verify', component: VerificationComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
