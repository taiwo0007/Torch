import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {ReviewTripDialogComponent} from "../../../shared/components/review-trip-dialog/review-trip-dialog.component";
import {ToastrService} from "ngx-toastr";
import {switchMap} from "rxjs";
import {EscooterService} from "../../../escooter/services/escooter.service";
import {LoadingService} from "../../../shared/services/loading.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-trip-completed',
    templateUrl: './trip-completed.component.html',
    styleUrls: ['./trip-completed.component.css']
})
export class TripCompletedComponent implements OnInit {
    tripID;

    constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private toastr: ToastrService,
                private escooterService: EscooterService, private loadingService: LoadingService) {

        setTimeout(() => {
            this.openDialog();
        }, 2000)
    }

    ngOnInit() {


        this.route.queryParams.subscribe(params => {

                if (!params['tripId']) {
                    this.router.navigate(['/error'])

                }
                this.tripID = params['tripId'];
                this.loadingService.isSuccess.next({message: 'Successfully completed trip: ' + this.tripID})


            },
            () => {
                this.router.navigate(['/error'])
            })
    }

    openDialog() {
        const dialogRef = this.dialog.open(ReviewTripDialogComponent, {
            height: '530px',
            width: '600px',
        });

        dialogRef.componentInstance.userReview.pipe(switchMap((choice: any) => {

            choice.tripID = this.tripID;

            console.log(choice)

            return this.escooterService.createHostScooterReview(choice)
        }))

            .subscribe(choice => {

                console.log(choice);
                dialogRef.close()

                this.loadingService.isSuccess.next({message: 'Your review has been submitted'})

            }, () => {
                this.loadingService.isError.next({message: 'An Error has occurred submitting your review'})

            })


    }

}
