import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {ActivatedRoute, Event, Router} from "@angular/router";
import {TripService} from "../../services/trip.service";
import {Trip} from "../../models/trip";
import {AreYouSureDialogComponent} from "../../../shared/components/are-you-sure-dialog/are-you-sure-dialog.component";
import {DialogService} from "../../../shared/services/dialog.service";
import {delay, filter, of, Subscription, switchMap, tap} from "rxjs";
import {
    AreYouSureDialogCancelComponent
} from "../../../shared/components/are-you-sure-dialog-cancel/are-you-sure-dialog-cancel.component";
import {LoadingService} from "../../../shared/services/loading.service";
import {ToastrService} from "ngx-toastr";
import {Host} from "../../../host/models/host.interface";
import {HostService} from "../../../host/services/host.service";
import {Discount} from "../../../escooter/models/discount.interface";
import {AuthService} from "../../../auth/services/auth.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges {
    @ViewChild('map', {static: false}) theMap: any;
    isNewlyBooked = false;
    tripId: number;
    trip: Trip;
    host: Host;
    initialCost: number;
    vatCost: number;
    totalCost: number;
    dialogRefComplete: any;
    dialogRefCancel: any;

    //rates
    ADVANCED_DISCOUNT_RATE: number = .30;
    BASIC_DISCOUNT_RATE: number = .10;
    PRO_DISCOUNT_RATE: number = 1;

    insurance: number;
    discountObject: Discount | undefined;
    todaysDate: Date = new Date()
    tripEndFormattedDate: Date;
    confirmSubscription: Subscription;
    cancelSubscription: Subscription;
    isError;
    isLoading = false;
    processingFee: number = 20;

    constructor(private route: ActivatedRoute,
                private tripService: TripService,
                private dialog: MatDialog,
                private dialogService: DialogService,
                private router: Router,
                private loadingService:LoadingService,
                private toastr: ToastrService,
                private hostService: HostService,
                private authService: AuthService) {
    }


    preTripCostCalculateForAccountTypes() {

        this.authService.user.subscribe((user: any) => {

            if (user._accountType) {
                this.processingFee = 0;

                let discountRate;
                if (user._accountType === 'Advanced') {
                    discountRate = this.ADVANCED_DISCOUNT_RATE;

                } else if (user._accountType === 'Pro') {
                    discountRate = this.PRO_DISCOUNT_RATE;

                } else {
                    discountRate = this.BASIC_DISCOUNT_RATE;
                }

                this.discountObject = {
                    insuranceDiscount: this.insurance - (this.insurance * discountRate),
                    accountType: user._accountType, percentageDiscount: discountRate,
                    insuranceOriginal: this.insurance
                };

                this.insurance = this.insurance - (this.insurance * discountRate);
                console.log("Advanced Insurance: " + this.insurance)

            }
            this.isLoading = false;
            this.calculateTripCost()
        })
    }


    ngOnInit(): void {
        this.isLoading = true;
        this.intialiseSuccessStatus();
        this.initTripId();
        this.isLoading = true;

        this.confirmSubscription = this.dialogService.confirmTripComplete
            .pipe(tap(() => {
                        this.loadingService.isLoadingLine.next(true);
                        this.isLoading = false
                    }
                ),
                switchMap((val: any) => {

                    return this.tripService.completeTripFromApi(this.tripId)
                })
            ).subscribe(
                (data: Trip) => {
                    console.log(data)
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false
                    this.router.navigate(['/trip-complete'], {queryParams: {tripId: data.tripId}})
                }, () => {
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false
                    this.router.navigate(['/error'])
                    this.isError = "An Error has occurred"
                }, () => {

                })

        this.cancelSubscription = this.dialogService.confirmTripCancel
            .pipe(tap(() => {
                        this.loadingService.isLoadingLine.next(true);
                        this.isLoading = false
                    }
                ),
                switchMap((val: any) => {
                    return this.tripService.cancelTripFromApi(this.tripId)
                })
            ).subscribe(
                (data: Trip) => {
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false
                    this.router.navigate(['/trip-cancel'], {queryParams: {tripId: data.tripId}})
                }, () => {
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false;
                    this.router.navigate(['/error'])
                    this.isError = "An Error has occurred"
                }, () => {
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false;
                })
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
    }


    intialiseSuccessStatus(): void {
        this.route.queryParams.subscribe((queryParams) => {
            this.isNewlyBooked = queryParams['success'];
            if (this.isNewlyBooked) {
                this.loadingService.isSuccess.next({message: 'Your Trip has been booked successfully'})
            }

        }, error1 => {
            console.log("error", error1)
        })
    }

    initTripId() {
        this.isLoading = true;
        this.route.params.subscribe(params => {
            this.tripId = params['id'];
            this.fetchTripDetails(this.tripId);
        })
    }

    getHostData(hostId: number) {
        this.hostService.getHostById(hostId).subscribe((hostData: any) => {
            this.insurance = hostData.insurance.cost;
            this.host = hostData;
            this.preTripCostCalculateForAccountTypes()
        })
    }

    fetchTripDetails(id: number) {
        this.isLoading = true;
        console.log("loading service placeholder")
        console.log(id)
        this.tripService.fetchTripDetailsFromApi(id).subscribe((tripData: any) => {
                this.tripEndFormattedDate = new Date(tripData.tripEnd);
                this.trip = tripData;

                console.log(this.trip)
                this.getHostData(tripData.trip_owner)


            },
            () => {
                this.isLoading = false;
                this.router.navigate(['/error'])

            })

    }

    calculateTripCost() {

        console.log(this.trip.days)
        this.initialCost = this.trip.days * this.trip.eScooterOnTrip.cost;
        this.vatCost = this.initialCost * 0.20;
        this.totalCost = this.initialCost + this.processingFee + this.vatCost + this.insurance;
        this.isLoading = false;

        setTimeout(() => this.initMap(this.trip.eScooterOnTrip.latitude, this.trip.eScooterOnTrip.longitude), 500)


    }

    initMap(lat: number, lng: number) {
        const location = {lat: lat, lng: lng}
        const options = {

            center: location,
            zoom: 11
        }

        const map = new google.maps.Map(document.getElementById("map"), options)

        new google.maps.Marker({
            position: location,
            map,
            title: "Hello World!",
            icon: "assets/images/website/icons/markerChanged.png"
        });
    }

    onCompleteTrip() {
        this.openCompleteDialog("complete-trip")
    }

    handleConfirm(event: Event) {
        console.log(event)
    }

    openCompleteDialog(dialogType: String): void {
        this.dialogRefComplete = this.dialog.open(AreYouSureDialogComponent, {
            height: '200px',
            width: '700px',
            data: {
                type: dialogType
            }
        });

        console.log(this.dialogRefComplete)

        this.dialogRefComplete.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    openCancelDialog(dialogType: String): void {
        this.dialogRefCancel = this.dialog.open(AreYouSureDialogCancelComponent, {
            height: '200px',
            width: '700px',
            data: {
                type: dialogType
            }
        });

        this.dialogRefCancel.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    onCancelTrip() {
        this.openCancelDialog("complete-trip")

    }
}
