import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';

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
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import { HostEscootersComponent } from './host/components/host-escooters/host-escooters.component';
import { HostEscooterCardComponent } from './host/components/host-escooter-card/host-escooter-card.component';
import { HostEscooterAddComponent } from './host/components/host-escooter-add/host-escooter-add.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { BecomeHostComponent } from './host/components/become-host/become-host.component';
import { AlertMessageComponent } from './shared/components/alert-message/alert-message.component';
import {NgxStarRatingModule} from "ngx-star-rating";
import { HostProfileComponent } from './host/components/host-profile/host-profile.component';
import { VerificationComponent } from './auth/components/verification/verification.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import { VerificationDialogComponent } from './shared/components/verification-dialog/verification-dialog.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import { CustomSkeletonLoaderComponent } from './escooter/components/custom-skeleton-loader/custom-skeleton-loader.component';
import {ImageModule} from "primeng/image";
import { AreYouSureDialogComponent } from './shared/components/are-you-sure-dialog/are-you-sure-dialog.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import { TripCompletedComponent } from './trip/components/trip-completed/trip-completed.component';
import { AreYouSureDialogCancelComponent } from './shared/components/are-you-sure-dialog-cancel/are-you-sure-dialog-cancel.component';
import { CancelTripComponent } from './trip/components/cancel-trip/cancel-trip.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { ReviewTripDialogComponent } from './shared/components/review-trip-dialog/review-trip-dialog.component';
import {ToastrModule} from "ngx-toastr";
import { SubscriptionModalComponent } from './user/components/subscription-modal/subscription-modal.component';
import { AdModalComponent } from './host/components/ad-modal/ad-modal.component';
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import { EscooterAdCardComponent } from './escooter/components/escooter-ad-card/escooter-ad-card.component';
import { LoadScreenComponent } from './shared/components/load-screen/load-screen.component';
import { VerifyEmailComponent } from './auth/components/verify-email/verify-email.component';
import { NavBarSearchComponent } from './shared/components/nav-bar-search/nav-bar-search.component';
import { NgbDatepickerConfigComponent } from './shared/components/ngb-datepicker-config/ngb-datepicker-config.component';
import {CalendarModule} from "primeng/calendar";
import { DeleteScooterDialogComponent } from './shared/components/delete-scooter-dialog/delete-scooter-dialog.component';
import {MatChipsModule} from "@angular/material/chips";
import { MobileNavBarComponent } from './shared/components/mobile-nav-bar/mobile-nav-bar.component';
import { LegacyInsuranceComponent } from './shared/components/legacy-insurance/legacy-insurance.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';


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
    HostEscootersComponent,
    HostEscooterCardComponent,
    HostEscooterAddComponent,
    BecomeHostComponent,
    AlertMessageComponent,
    HostProfileComponent,
    VerificationComponent,
    VerificationDialogComponent,
    CustomSkeletonLoaderComponent,
    AreYouSureDialogComponent,
    TripCompletedComponent,
    AreYouSureDialogCancelComponent,
    CancelTripComponent,

    ReviewTripDialogComponent,
     SubscriptionModalComponent,
     AdModalComponent,
     EscooterAdCardComponent,
     LoadScreenComponent,
     VerifyEmailComponent,
     NavBarSearchComponent,
     NgbDatepickerConfigComponent,
     DeleteScooterDialogComponent,
     MobileNavBarComponent,
     LegacyInsuranceComponent,
     PrivacyPolicyComponent,

  ],
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatNativeDateModule,
        MatMomentDateModule,
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
        GooglePlaceModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxStarRatingModule,
        MatStepperModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        NgxSkeletonLoaderModule,
        ImageModule,
        ConfirmDialogModule,
        ToastModule,
        MatProgressBarModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(),
        MatIconModule,
        MatExpansionModule,
        CalendarModule,


    ],
  providers: [MessageService, ConfirmationService, BsDropdownDirective, BsDropdownConfig, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
