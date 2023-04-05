import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ReviewTripDialogComponent} from "../../../shared/components/review-trip-dialog/review-trip-dialog.component";
import {switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EscooterService} from "../../../escooter/services/escooter.service";

@Component({
  selector: 'app-cancel-trip',
  templateUrl: './cancel-trip.component.html',
  styleUrls: ['./cancel-trip.component.css']
})
export class CancelTripComponent {
  tripID;

  constructor(private route:ActivatedRoute, private router:Router, private toastr:ToastrService,
              private dialog:MatDialog, private escooterService:EscooterService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

          if(!params['tripId']){
            this.router.navigate(['/error'])

          }
          this.tripID = params['tripId'];
            this.toastr.success(  'Successfully Cancelled', 'Trip: '+this.tripID, {
                positionClass: 'toast-top-center'
            });

            setTimeout(() => {
                this.openDialog();
            }, 1000)


        },
        ()=> {
          this.router.navigate(['/error'])
        })
  }

    openDialog() {
        const dialogRef = this.dialog.open(ReviewTripDialogComponent, {
            height: '530px',
            width: '600px',
        });

        dialogRef.componentInstance.userReview.pipe(switchMap(choice => {

            choice.tripID = this.tripID;

            console.log(choice)

            return this.escooterService.createHostScooterReview(choice)
        }))

            .subscribe(choice => {

                console.log(choice);
                dialogRef.close()

                this.toastr.success(  'Review Submitted', '', {
                    positionClass: 'toast-top-center'
                });

            }, ()=>{
                this.toastr.warning(  'Review not Submitted', '', {
                    positionClass: 'toast-top-center'
                });
            })


    }


}
