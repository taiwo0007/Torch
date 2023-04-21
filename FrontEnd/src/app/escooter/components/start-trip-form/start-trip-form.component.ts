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
import {Escooter} from "../../models/escooter.interface";
import {Moment} from "moment";

@Component({
    selector: 'app-start-trip-form',
    templateUrl: './start-trip-form.component.html',
    styleUrls: ['./start-trip-form.component.css'],
})
export class StartTripFormComponent implements OnInit, AfterViewInit {





    isAuthenticated = false;
    @Input() cost;
    @Input() escooter:Escooter;
    @ViewChild("arrow",{static: false}) arrow: ElementRef;
    @Input() escooterId;
    todaysDate = new Date()
    tommorwsDate = new Date();
    user: any;
    rangeDates: any;
    formattedToday:any = moment();
    formattedTripStart:any = moment();

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
        this.formattedTripStart = moment(this.escooter.tripStart)
        this.formattedToday = moment()

        // console.log('diff')
        // console.log(date1.diff(date2, 'days'))


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
