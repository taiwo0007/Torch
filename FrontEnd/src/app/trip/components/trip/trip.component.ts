import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Event, Router} from "@angular/router";
import {TripService} from "../../services/trip.service";
import {Trip} from "../../models/trip";
import {AreYouSureDialogComponent} from "../../../shared/components/are-you-sure-dialog/are-you-sure-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogService} from "../../../shared/services/dialog.service";
import {delay, filter, of, Subscription, switchMap} from "rxjs";
import {
    AreYouSureDialogCancelComponent
} from "../../../shared/components/are-you-sure-dialog-cancel/are-you-sure-dialog-cancel.component";
import {LoadingService} from "../../../shared/services/loading.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit, AfterViewInit {
    isNewlyBooked = false;
    tripId: number;
    trip: Trip;
    initialCost: number;
    vatCost: number;
    totalCost: number;
    todaysDate: Date = new Date()
    tripEndFormattedDate: Date;
    confirmSubscription: Subscription;
    cancelSubscription: Subscription;
    isError;
    isLoading = false;

    constructor(private route: ActivatedRoute,
                private tripService: TripService,
                private dialog: MatDialog,
                private dialogService: DialogService,
                private router: Router,
                private loadingService: LoadingService,
                private toastr: ToastrService) {
    }

    ngOnInit(): void {

        this.isLoading = true;
        console.log("loading service placeholder")
        this.loadingService.isLoading.next(true)
        this.intialiseSuccessStatus();
        this.initTripId();
        console.log(this.todaysDate)
        this.isLoading = true;
        this.confirmSubscription = this.dialogService.confirmTripComplete
            .pipe(
                switchMap((val: any) => {
                    this.loadingService.isLoadingLine.next(true);
                    this.isLoading = false

                    return this.tripService.completeTripFromApi(this.tripId)
                })
            ).subscribe(
                (data: Trip) => {
                    console.log(data)
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false
                    this.router.navigate(['/trip-complete'], {queryParams: {tripId: data.tripId}})
                }, () => {
                    this.isError = "An Error has occurred"
                }, () => {
                    this.loadingService.isLoadingLine.next(false);

                    this.isLoading = false;
                })

        this.cancelSubscription = this.dialogService.confirmTripCancel
            .pipe(
                switchMap((val: any) => {
                    this.loadingService.isLoadingLine.next(true);

                    this.isLoading = true;
                    return this.tripService.cancelTripFromApi(this.tripId)
                })
            ).subscribe(
                (data: Trip) => {
                    console.log(data)
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false

                    this.router.navigate(['/trip-cancel'], {queryParams: {tripId: data.tripId}})
                }, () => {
                    this.loadingService.isLoadingLine.next(false);
                    this.isLoading = false;
                    this.isError = "An Error has occurred"
                }, () => {
                    this.loadingService.isLoadingLine.next(false);

                    this.isLoading = false;
                })




    }

    ngAfterViewInit() {

        console.log(this.trip)

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
        console.log("loading service placeholder")
        this.loadingService.isLoading.next(true)
        this.route.params.subscribe(params => {
            this.tripId = params['id'];
            console.log(this.tripId)
            this.fetchTripDetails(this.tripId);
        })
    }

    fetchTripDetails(id: number) {
        this.isLoading = true;
        console.log("loading service placeholder")
        this.loadingService.isLoading.next(true)
        console.log(id)
        this.tripService.fetchTripDetailsFromApi(id).subscribe((tripData: any) => {
            this.tripEndFormattedDate = new Date(tripData.tripEnd);
            this.trip = tripData;
            this.loadingService.isLoading.next(false)
            this.isLoading = false;
            this.calculateTripCost()

            setTimeout(()=>{

                this.initMap()
            },1000)
        },
            ()=>{
                this.loadingService.isLoading.next(false)
                this.isLoading = false

            })

    }

    calculateTripCost() {
        console.log(this.trip.days)
        this.initialCost = this.trip.days * this.trip.eScooterOnTrip.cost;
        this.vatCost = this.initialCost * 0.20;
        this.totalCost = this.initialCost + 20 + this.vatCost;
    }

    initMap() {
        var location = {lat: 53.410980, lng: -6.400090}
        var options = {

            center: location,
            zoom: 15
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
        const dialogRef = this.dialog.open(AreYouSureDialogComponent, {
            height: '200px',
            width: '700px',
            data: {
                type: dialogType
            }
        });

        console.log(dialogRef)

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    openCancelDialog(dialogType: String): void {
        const dialogRef = this.dialog.open(AreYouSureDialogCancelComponent, {
            height: '200px',
            width: '700px',
            data: {
                type: dialogType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    onCancelTrip() {
        this.openCancelDialog("complete-trip")

    }
}
