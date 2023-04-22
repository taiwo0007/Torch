import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {StripeService, StripePaymentElementComponent} from 'ngx-stripe';
import {
    StripeElementsOptions,
    Appearance, StripeError
} from '@stripe/stripe-js';
import {environment} from "../../../../environments/environment";
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Escooter} from "../../models/escooter.interface";
import {TripService} from "../../../trip/services/trip.service";
import {TripCreateRequestPayload} from "../../../trip/models/trip-create-request.payload";
import {LoadingService} from "../../../shared/services/loading.service";
import {Host} from "../../../host/models/host.interface";
import {HostService} from "../../../host/services/host.service";
import {AuthService} from "../../../auth/services/auth.service";
import {Discount} from "../../models/discount.interface";
import {MatDialog} from "@angular/material/dialog";


@Component({
    selector: 'app-escoooter-booking',
    templateUrl: './escoooter-booking.component.html',
    styleUrls: ['./escoooter-booking.component.css']
})
export class EscoooterBookingComponent implements OnInit {
    @ViewChild(StripePaymentElementComponent)
    paymentElement: StripePaymentElementComponent;
    escooter: Escooter;
    host: Host;
    tripDays: number;
    initialCost: number;
    totalCost: number;
    insurance: number;
    discountPercentage: number;
    vatCost: number;
    discountObject: Discount | undefined;
    tripStart: Date;

    //rates
    ADVANCED_DISCOUNT_RATE: number = .30;
    BASIC_DISCOUNT_RATE: number = .10;
    PRO_DISCOUNT_RATE: number = 1;
    //mutable
    processingFee: number = 20;
    isLoading: boolean;

    insuranceBeforeDiscount: number;
    isProDiscount: boolean = false;
    isAdvancedDiscount: boolean = false;
    isBasicDiscount: boolean = false;
    tripEnd: Date;
    isButtonShow: boolean;
    tripCreateRequestPayload: TripCreateRequestPayload

    checkoutForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        address: ['', [Validators.required]],
        zipcode: ['', [Validators.required]],
        city: ['', [Validators.required]],
        amount: [2500, [Validators.required, Validators.pattern(/\d+/)]],
    });

    appearance: Appearance = {
        theme: 'flat',
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
    error: StripeError;


    constructor(
        private fb: UntypedFormBuilder,
        public dialog: MatDialog,
        private stripeService: StripeService,
        private http: HttpClient,
        private escooterService: EscooterService,
        private route: ActivatedRoute,
        private tripService: TripService,
        private router: Router,
        private loadingService: LoadingService,
        private hostService: HostService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.loadingService.isLoading.next(true);

        this.route.queryParams.subscribe(paramValue => {
            this.tripDays = +paramValue['tripDays'];
            this.tripStart = paramValue['tripStart'];
            this.tripEnd = paramValue['tripEnd'];
        })

        this.route.params.subscribe(params => {
            this.escooterService.getEscooterById(params['id']).subscribe(data => {
                this.escooter = data;
                this.initHostData()
            })
        })
    }


    get amount() {
        if (
            !this.checkoutForm.get('amount') ||
            !this.checkoutForm.get('amount').value
        )
            return 0;
        const amount = this.checkoutForm.get('amount').value;
        return Number(amount) / 100;
    }


//get host related data for insurance information
//we need this data for calculating insurance data

    initHostData() {

        this.hostService.getHostById(this.escooter.host).subscribe((data: Host) => {
                this.insurance = data.insurance.cost;
                this.host = data;



                //get account type of currently logged-in user
                this.authService.user.subscribe((user: any) => {
                    console.log(user)
                    if (user._accountType) {

                        //processing fee is 0 if an account type.
                        this.processingFee = 0;

                        if (user._accountType === 'Pro') {
                            this.insuranceBeforeDiscount = data.insurance.cost;
                            this.discountPercentage = this.PRO_DISCOUNT_RATE;

                            this.discountObject = {
                                insuranceDiscount: data.insurance.cost - (data.insurance.cost * this.PRO_DISCOUNT_RATE),
                                accountType: user._accountType, percentageDiscount: this.discountPercentage,
                                insuranceOriginal: data.insurance.cost
                            };

                            this.insurance = data.insurance.cost - (data.insurance.cost * this.PRO_DISCOUNT_RATE);
                            console.log("Pro Insurance: " + this.insurance)

                        } else if (user._accountType === 'Advanced') {

                            this.insuranceBeforeDiscount = data.insurance.cost;
                            this.discountPercentage = this.ADVANCED_DISCOUNT_RATE;

                            this.discountObject = {
                                insuranceDiscount: data.insurance.cost - (data.insurance.cost * this.ADVANCED_DISCOUNT_RATE),
                                accountType: user._accountType, percentageDiscount: this.discountPercentage,
                                insuranceOriginal: data.insurance.cost
                            };

                            this.insurance = data.insurance.cost - (data.insurance.cost * this.ADVANCED_DISCOUNT_RATE);
                            console.log("Advanced Insurance: " + this.insurance)

                        } else if (user._accountType === 'Basic') {
                            this.insuranceBeforeDiscount = data.insurance.cost;
                            this.discountPercentage = this.BASIC_DISCOUNT_RATE;

                            this.discountObject = {
                                insuranceDiscount: data.insurance.cost - (data.insurance.cost * this.BASIC_DISCOUNT_RATE),
                                accountType: user._accountType, percentageDiscount: this.discountPercentage,
                                insuranceOriginal: data.insurance.cost
                            };

                            this.insurance = data.insurance.cost - (data.insurance.cost * this.BASIC_DISCOUNT_RATE);
                            console.log("Basic Insurance: " + this.insurance)
                        } else {
                            this.insurance = data.insurance.cost;
                            console.log("None Insurance: " + this.insurance)
                        }

                        console.log("if account insurance value:" + this.insurance)
                    }

                    console.log("calulcating.....")
                    console.log(this.insurance)

                })

            }, () => {

            },
            () => {

            console.log(this.discountObject)



                this.totalTripCost()
                this.createPaymentIntentFromApi();

            })

    }

    createPaymentIntentFromApi() {
        this.createPaymentIntent(this.totalCost)
            .subscribe(paymentIntent => {
                    console.log(paymentIntent)

                    this.elementsOptions.clientSecret = paymentIntent.clientSecret;
                    this.isLoading = false;
                    this.loadingService.isLoading.next(false)

                },
                () => {

                }, ()=> {





                });
    }

    totalTripCost() {

        this.initialCost = this.tripDays * this.escooter.cost;
        this.vatCost = this.initialCost * 0.20;
        this.totalCost = this.initialCost + this.processingFee + this.vatCost + this.insurance;

        console.log("calculated data")
        console.log(this.vatCost)
        console.log(this.totalCost)
        console.log(this.initialCost)


    }

    private createPaymentIntent(amount: number): Observable<any> {
        return this.http.post<any>(
            environment.appUrl + "/create-payment-intent",
            {
                cost: amount
            }
        );
    }

    collectPayment() {

        // if (this.paying) return;


        this.tripCreateRequestPayload = {
            tripCost: this.totalCost,
            tripStart: this.tripStart,
            tripEnd: this.tripEnd,
            eid: this.escooter.id,
            tripDays: this.tripDays

        }


        console.log("TripRequest Data", this.tripCreateRequestPayload)

        this.paying = true;

        this.stripeService
            .confirmPayment({
                elements: this.paymentElement.elements,
                redirect: 'if_required',
            })
            .subscribe({

                next: (result) => {


                    if (result.error) {
                        this.paying = false;
                        this.error = result.error
                    } else if (result.paymentIntent.status === 'succeeded') {

                        console.log(this.tripCreateRequestPayload)

                        this.tripService.createNewTrip(this.tripCreateRequestPayload).subscribe(((tripData: any) => {
                            this.loadingService.isLoadingLine.next(false);
                            this.paying = false;
                            this.router.navigate(['../trip-detail', tripData?.id], {queryParams: {success: true}})
                        }))
                    }
                },
                error: (err) => {

                    this.paying = false;

                },
            });
    }

}
