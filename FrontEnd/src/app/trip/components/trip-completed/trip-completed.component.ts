import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  VerificationDialogComponent
} from "../../../shared/components/verification-dialog/verification-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ReviewTripDialogComponent} from "../../../shared/components/review-trip-dialog/review-trip-dialog.component";
import {ReviewFormComponent} from "../../../escooter/components/review-form/review-form.component";
import {ToastrService} from "ngx-toastr";
import {catchError, of, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {HostService} from "../../../host/services/host.service";
import {EscooterService} from "../../../escooter/services/escooter.service";

@Component({
  selector: 'app-trip-completed',
  templateUrl: './trip-completed.component.html',
  styleUrls: ['./trip-completed.component.css']
})
export class TripCompletedComponent implements OnInit{
  tripID;

  constructor(private route:ActivatedRoute, private router:Router, private dialog:MatDialog, private toastr:ToastrService,
              private escooterService:EscooterService) {
  }

  ngOnInit() {




    this.route.queryParams.subscribe(params => {

      if(!params['tripId']){
        this.router.navigate(['/error'])

      }
      this.tripID = params['tripId'];
          this.toastr.success(  'Successfully Complete', "Trip: " +this.tripID, {
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

    },()=>{
          this.toastr.warning(  'Review not Submitted', '', {
            positionClass: 'toast-top-center'
          });
        })


  }

}
