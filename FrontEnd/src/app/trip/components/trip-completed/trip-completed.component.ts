import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  VerificationDialogComponent
} from "../../../shared/components/verification-dialog/verification-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ReviewTripDialogComponent} from "../../../shared/components/review-trip-dialog/review-trip-dialog.component";
import {ReviewFormComponent} from "../../../escooter/components/review-form/review-form.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-trip-completed',
  templateUrl: './trip-completed.component.html',
  styleUrls: ['./trip-completed.component.css']
})
export class TripCompletedComponent implements OnInit{
  tripID;

  constructor(private route:ActivatedRoute, private router:Router, private dialog:MatDialog, private toastr:ToastrService) {
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
      }, 3000)



    },
        ()=> {
          this.router.navigate(['/error'])
        })
  }

  openDialog() {
    const dialogRef = this.dialog.open(ReviewTripDialogComponent, {
      height: '630px',
      width: '600px',
    });
  }

}
