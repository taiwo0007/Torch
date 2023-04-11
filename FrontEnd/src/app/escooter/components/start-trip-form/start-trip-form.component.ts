import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {User} from "../../../user/models/user.model";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-start-trip-form',
  templateUrl: './start-trip-form.component.html',
  styleUrls: ['./start-trip-form.component.css']
})
export class StartTripFormComponent implements OnInit {
  isAuthenticated = false;
  @Input() cost;
  @Input() escooterId;
  todaysDate = new Date().toISOString().split('T')[0];
  tommorwsDate = new Date();
  user:any;
  rangeDates: any;


  constructor(private authService: AuthService,
              private router:Router,
              ) {

  }

  ngOnInit(): void {
    console.log(this.todaysDate)

    this.authService.user.subscribe((data:any) => {

      this.user = data;
      this.isAuthenticated = data;
    })

  }

    onSubmit(StartTipForm: NgForm) {
      if(!StartTipForm.valid){
        return
      }
      if(this.user._isVerified == false || this.user == undefined){

        this.authService.openDialog();
        return;
      }

      console.log(this.user)

        let tripStart = new Date(StartTipForm.value.tripStart)
        let tripEnd = new Date(StartTipForm.value.tripEnd)

        let daysBetween = Math.round((tripEnd.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24));
        console.log(daysBetween)

      const queryParams = {
          tripDays: daysBetween,
        tripStart: StartTipForm.value.tripStart,
        tripEnd: StartTipForm.value.tripEnd
      }

        this.router.navigate(['../escooter-booking',this.escooterId],
            {
              queryParams
            })




    }


}
