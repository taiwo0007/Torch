import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-cancel-trip',
  templateUrl: './cancel-trip.component.html',
  styleUrls: ['./cancel-trip.component.css']
})
export class CancelTripComponent {
  tripID;

  constructor(private route:ActivatedRoute, private router:Router, private toastr:ToastrService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

          if(!params['tripId']){
            this.router.navigate(['/error'])

          }
          this.tripID = params['tripId'];
            this.toastr.success(  'Trip Successfully Cancelled', '', {
                positionClass: 'toast-top-center'
            });


        },
        ()=> {
          this.router.navigate(['/error'])
        })
  }


}
