import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, NgForm} from "@angular/forms";
import {EscooterService} from "../../../escooter/services/escooter.service";
import {Router} from "@angular/router";
import {Options} from 'ngx-google-places-autocomplete/objects/options/options';
import {Address} from "ngx-google-places-autocomplete/objects/address";
import * as moment from "moment";

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    tripStart: any;
    @ViewChild("arrow", {static: false}) arrow: ElementRef;
    tripEnd: any;
    location: any;
    @ViewChild("searchForm") searchForm: NgForm;
    today = new Date()
    todaysDate = new Date().toISOString().split('T')[0];
    tommorowsDate: any = new Date(this.today.getTime() + (24 * 60 * 60 * 1000));

    isGooglePlaceSelected: boolean = false;
    googlePlaceLocation: any;
    options: Options = new Options({
        bounds: undefined, fields: ['geometry', 'name'], strictBounds: false,
        types: ['establishment'],
        componentRestrictions: {country: 'ie'}
    });
    searchFormReactive = this._formBuilder.group({
        location: ['Blanchardstown, Dublin'],
        tripStart: [moment()],
        tripEnd: [moment().add(1, 'day')],

    });


    constructor(private escooterService: EscooterService,
                private router: Router, private _formBuilder: FormBuilder) {
    }

    ngOnInit(): void {

        let myMoment = moment();

        let tomorrow = new Date(new Date())
        tomorrow.setDate(tomorrow.getDate() + 1)
        this.tommorowsDate = tomorrow.toISOString().split('T')[0];

        setTimeout(() => {
                this.searchForm.value.tripStart = this.todaysDate;

            },
            1000)

        this.initMap();
    }

    onSubmit() {

        console.log(this.searchFormReactive.value.tripEnd);
        console.log(this.searchFormReactive.value.tripStart)

        this.tripStart = moment(this.searchFormReactive.value.tripStart)
        this.tripEnd = moment(this.searchFormReactive.value.tripEnd)
        this.location = this.searchFormReactive.value.location

        if (this.googlePlaceLocation) {
            this.location = this.googlePlaceLocation;
        }
        //if we get form values from moment js, then clean up
        if (this.tripEnd) {
            let eMonth = this.tripEnd
            this.tripEnd = `${this.tripEnd.year()}-${eMonth.format("MM")}-${this.tripEnd.date()}`;
        }
        if (this.tripStart) {
            let sMonth = this.tripStart
            this.tripStart = `${this.tripStart.year()}-${sMonth.format("MM")}-${this.tripStart.date()}`;
        }
        const queryParams = {
            tripStart: this.tripStart,
            tripEnd: this.tripEnd,
            location: this.location
        }

        this.router.navigate(['results'],
            {queryParams})
    }

    makeImageNavigateToResults() {
        const queryParams = {
            tripStart: '',
            tripEnd: '',
            location: ''
        }

        this.router.navigate(['results'],
            {queryParams})

    }

    initMap() {

        // @ts-ignore
        const autocomplete = new google.maps.places.Autocomplete(document.getElementById("country"), {

            componentRestrictions: {'country': ['ie']},
            fields: ['geometry', 'name'],
            types: ['establishment']
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

    handleAddressChange(locationData: Address) {

        console.log(location)

        this.googlePlaceLocation = locationData.name;
        this.isGooglePlaceSelected = true;
        console.log(locationData)

    }

    alert() {
        alert("hello world")
    }
}
