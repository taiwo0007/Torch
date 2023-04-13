import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, NgForm} from "@angular/forms";
import {User} from "../../../user/models/user.model";
import {LoadingService} from "../../../shared/services/loading.service";
import * as moment from "moment";

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
    user: any;
    rangeDates: any;
    startTripForm = this._formBuilder.group({
        tripStart: [moment()],
        tripEnd: [moment().add(1, 'day')],

    });


    constructor(private authService: AuthService,
                private router: Router,
                private _formBuilder: FormBuilder) {

    }

    ngOnInit(): void {

        this.authService.user.subscribe((data: any) => {

            this.user = data;
            this.isAuthenticated = data;
        })

        console.log("month "+this.startTripForm.value.tripStart.month())


    }



    onSubmit() {
        if (!this.startTripForm.valid) {
            return
        }
        if (this.user._isVerified == false || this.user == undefined) {

            this.authService.openDialog();
            return;
        }

        console.log(this.user)

        //temp tech dept moment month incorrect
        let sMonth = this.startTripForm.value.tripStart
        let eMonth = this.startTripForm.value.tripEnd

        let tripStart = `${this.startTripForm.value.tripStart.year()}-${sMonth.format("MM")}-${this.startTripForm.value.tripStart.date()}`
        let tripEnd = `${this.startTripForm.value.tripEnd.year()}-${eMonth.format("MM")}-${this.startTripForm.value.tripEnd.date()}`

        let daysBetween = this.startTripForm.value.tripEnd.diff(this.startTripForm.value.tripStart, 'days');
        console.log(daysBetween)

        console.log(tripStart)
        console.log(tripEnd)


        const queryParams = {
            tripDays: daysBetween,
            tripStart,
            tripEnd
        }

        this.router.navigate(['../escooter-booking', this.escooterId],
            {
                queryParams
            })


    }


}
