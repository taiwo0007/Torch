import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-start-trip-form',
  templateUrl: './start-trip-form.component.html',
  styleUrls: ['./start-trip-form.component.css']
})
export class StartTripFormComponent implements OnInit {
  isAuthenticated = false;
  @Input() cost;
  @Input() escooterId;
  todaysDate = new Date();
  tommorwsDate = new Date(this.todaysDate.getDate()+1)

  constructor(private authService: AuthService,
              private router:Router) { }

  ngOnInit(): void {

    this.authService.user.subscribe((data:boolean) => {

      this.isAuthenticated = data;
    })

  }

    onSubmit(StartTipForm: NgForm) {
      if(!StartTipForm.valid){
        return
      }

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
