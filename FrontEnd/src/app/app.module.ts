import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './home/components/home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import { ReviewFormComponent } from './escooter/components/review-form/review-form.component';
import { EscoooterBookingComponent } from './escooter/components/escoooter-booking/escoooter-booking.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgxStripeModule} from "ngx-stripe";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { TripComponent } from './trip/components/trip/trip.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { HostDetailsCardComponent } from './trip/components/host-details-card/host-details-card.component';
import { AddressSplitPipe } from './shared/pipes/address-split.pipe';
import { CostInfoCardComponent } from './escooter/components/cost-info-card/cost-info-card.component';
import { UserTripsComponent } from './trip/components/user-trips/user-trips.component';
import { TripStatsHeaderComponent } from './trip/components/trip-stats-header/trip-stats-header.component';
import { TripHistoryCardComponent } from './trip/components/trip-history-card/trip-history-card.component';
import { TripHistoryItemComponent } from './trip/components/trip-history-item/trip-history-item.component';
import { UserNamePlaceholderComponent } from './user/components/user-name-placeholder/user-name-placeholder.component';
import { HostNamePlaceholderComponent } from './host/components/host-name-placeholder/host-name-placeholder.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { TripHostsComponent } from './trip/components/trip-hosts/trip-hosts.component';
import { TripHostStatsHeaderComponent } from './trip/components/trip-host-stats-header/trip-host-stats-header.component';

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
    MiniHostCardComponent,
    ReviewFormComponent,
    EscoooterBookingComponent,
    TripComponent,
    ErrorComponent,
    HostDetailsCardComponent,
    AddressSplitPipe,
    CostInfoCardComponent,
    UserTripsComponent,
    TripStatsHeaderComponent,
    TripHistoryCardComponent,
    TripHistoryItemComponent,
    UserNamePlaceholderComponent,
    HostNamePlaceholderComponent,
    TripHostsComponent,
    TripHostStatsHeaderComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        BsDropdownModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxStripeModule.forRoot('pk_test_51M5pMwBapNSScoYvl9KdhcEEvyCUp41XXVqqzOKxQo7XAzXlm42PnZQIOvnshRre0hYUIpzEk22qz2i4gEfODZkI00AjRfjVul'),
        MatInputModule,
        MatToolbarModule,
        MatCardModule,
        MatDividerModule,
        MatDialogModule,
        MatButtonModule,
        GoogleMapsModule,


    ],
  providers: [BsDropdownDirective, BsDropdownConfig, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
