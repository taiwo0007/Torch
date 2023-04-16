import {
    AfterViewInit,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    Input,
    NO_ERRORS_SCHEMA,
    OnInit,
    ViewChild
} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, NgForm} from "@angular/forms";
import {User} from "../../../user/models/user.model";
import {LoadingService} from "../../../shared/services/loading.service";
import * as moment from "moment";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
    selector: 'app-start-trip-form',
    templateUrl: './start-trip-form.component.html',
    styleUrls: ['./start-trip-form.component.css'],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class StartTripFormComponent implements OnInit, AfterViewInit {



    startDate: Date = new Date();
    endDate: Date = new Date(this.startDate.getTime() + (24 * 60 * 60 * 1000));

    // define a function to filter the selectable dates
    dateFilter = (date: Date | null) => {
        // return true if the date is between startDate and endDate
        return date >= this.startDate && date <= this.endDate;
    }

    // update the end date when the start date changes
    onStartDateChange(event: MatDatepickerInputEvent<Date>) {
        this.endDate = new Date(event.value.getTime() + (24 * 60 * 60 * 1000));
    }


    isAuthenticated = false;
    @Input() cost;
    @ViewChild("arrow",{static: false}) arrow: ElementRef;
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



    ngAfterViewInit() {
        console.log(this.arrow.nativeElement)

    }

    ngOnInit(): void {

        this.authService.user.subscribe((data: any) => {

            this.user = data;
            this.isAuthenticated = data;
        })
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


    onMouseButton() {
        console.log(this.arrow.nativeElement)

        this.arrow.nativeElement.style.transform = 'translateX(10px)'

    }
    onMouseOutButton() {
        console.log(this.arrow.nativeElement)

        this.arrow.nativeElement.style.transform = 'translateX(0)'

    }
}
