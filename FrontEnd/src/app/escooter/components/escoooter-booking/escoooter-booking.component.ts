import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import {
  StripeElementsOptions,
  PaymentIntent, Appearance
} from '@stripe/stripe-js';
import {environment} from "../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Escooter} from "../../models/escooter.interface";
import {Trip} from "../../models/trip.interface";
import {TripService} from "../../../trip/services/trip.service";


@Component({
  selector: 'app-escoooter-booking',
  templateUrl: './escoooter-booking.component.html',
  styleUrls: ['./escoooter-booking.component.css']
})
export class EscoooterBookingComponent implements OnInit{
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;
  escooter: Escooter;
  tripDays:number;
  initialCost:number;
  totalCost:number;
  vatCost:number;

  checkoutForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    address: ['', [Validators.required]],
    zipcode: ['', [Validators.required]],
    city: ['', [Validators.required]],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]],
  });

  appearance: Appearance = {
    theme: 'stripe',
    labels: 'floating',
    // variables: {
    //   colorPrimary: '#ffc7ee',
    // },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    clientSecret: null
  };

  paying = false;

  get amount() {
    if (
        !this.checkoutForm.get('amount') ||
        !this.checkoutForm.get('amount').value
    )
      return 0;
    const amount = this.checkoutForm.get('amount').value;
    return Number(amount) / 100;
  }



  constructor(
      private fb: FormBuilder,
      public dialog: MatDialog,
      private stripeService: StripeService,
      private http:HttpClient,
      private escooterService: EscooterService,
      private route: ActivatedRoute,
      private tripService: TripService,
      private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(paramValue => {
      this.tripDays = +paramValue['tripDays']
    })


    this.route.params.subscribe(params => {

      this.escooterService.getEscooterById(params['id']).subscribe(data => {
        this.escooter = data;
        this.totalTripCost()
        this.createPaymentIntent(this.totalCost)
            .subscribe(paymentIntent => {
              this.elementsOptions.clientSecret = paymentIntent.clientSecret;
            });
      })
    })
  }

  totalTripCost(){
    this.initialCost = this.tripDays * this.escooter.cost;
    this.vatCost = this.initialCost * 0.20;
    this.totalCost = this.initialCost + 20 + this.vatCost;
  }

  private createPaymentIntent(amount: number): Observable<any> {
    return this.http.post<any>(
        environment.appUrl+"/create-payment-intent",
        {
          cost: amount
        }
    );
  }

  collectPayment() {
    if (this.paying) return;
    // if (this.checkoutForm.invalid) {
    //   return;
    // }

    this.paying = true;
    this.stripeService
        .confirmPayment({
          elements: this.paymentElement.elements,
          redirect: 'if_required',
        })
        .subscribe({
          next: (result) => {
            this.paying = false;
            if (result.error) {

            } else if (result.paymentIntent.status === 'succeeded') {

              this.tripService.createNewTrip(this.escooter.id).subscribe((tripId) => {

                this.router.navigate(['../trip', tripId],{ queryParams: { success: true } })
              })
            }
          },
          error: (err) => {
            this.paying = false;

          },
        });
  }

}
