import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './home/components/home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BsDropdownConfig, BsDropdownDirective, BsDropdownModule} from "ngx-bootstrap/dropdown";
import { NavbarAuthComponent } from './shared/components/navbar-auth/navbar-auth.component';
import { UserProfileComponent } from './user/components/user-profile/user-profile.component';
import { ProfileDetailsCardComponent } from './user/components/profile-details-card/profile-details-card.component';
import { ProfileFormCardComponent } from './user/components/profile-form-card/profile-form-card.component';
import {AuthInterceptorService} from "./auth/services/auth-interceptor.service";
import { SearchFormComponent } from './home/components/search-form/search-form.component';
import { EscooterResultsComponent } from './escooter/components/escooter-results/escooter-results.component';
import { EscooterCardComponent } from './escooter/components/escooter-card/escooter-card.component';
import { EscooterDetailComponent } from './escooter/components/escooter-detail/escooter-detail.component';
import { StartTripFormComponent } from './escooter/components/start-trip-form/start-trip-form.component';
import { ReviewsListComponent } from './escooter/components/reviews-list/reviews-list.component';
import { ReviewComponent } from './escooter/components/review/review.component';
import { MiniHostCardComponent } from './escooter/components/mini-host-card/mini-host-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    SpinnerComponent,
    NavbarAuthComponent,
    UserProfileComponent,
    ProfileDetailsCardComponent,
    ProfileFormCardComponent,
    SearchFormComponent,
    EscooterResultsComponent,
    EscooterCardComponent,
    EscooterDetailComponent,
    StartTripFormComponent,
    ReviewsListComponent,
    ReviewComponent,
    MiniHostCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule

  ],
  providers: [BsDropdownDirective, BsDropdownConfig, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
