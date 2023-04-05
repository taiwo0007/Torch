import {Component, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {EscooterService} from "../../../escooter/services/escooter.service";
import {Router} from "@angular/router";
import {Options} from "ngx-google-places-autocomplete/objects/options/options";

@Component({
  selector: 'app-nav-bar-search',
  templateUrl: './nav-bar-search.component.html',
  styleUrls: ['./nav-bar-search.component.css']
})
export class NavBarSearchComponent implements OnDestroy{

  @ViewChild("searchForm") searchForm;
  tripStart:any;
  tripEnd:any;
  location:any;
  isGooglePlaceSelected:boolean = false;
  googlePlaceLocation:any;
  options:Options = new Options({
    bounds: undefined, fields: ['geometry', 'name'], strictBounds: false,
    types: ['establishment'],
    componentRestrictions: {country: 'ie'}
  });


  constructor(private escooterService: EscooterService,
              private router: Router) { }

  hello(){

    console.log("hello world")
  }

  onSubmit(searchForm: NgForm) {

    this.tripStart = ''
    this.tripEnd = ''
    this.location = searchForm.value.location

    if(this.googlePlaceLocation){
      this.location = this.googlePlaceLocation;
    }


    console.log(this.location)

    const queryParams = { tripStart: '',
      tripEnd: '',
      location: this.location
    }

 console.log(queryParams)

    this.router.navigate(['/results'],
        { queryParams})

  }

  initMap() {

    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById("country"), {

      componentRestrictions : {'country': ['ie']},
      fields: ['geometry', 'name'],
      types: ['establishment']
    })

  }

  handleAddressChange(locationData: Address) {


    //
    // this.googlePlaceLocation = locationData.name;
    // this.isGooglePlaceSelected = true;
    console.log(locationData)

    this.onSubmit(this.searchForm);

  }

  ngOnDestroy() {
    this.searchForm.reset();

  }
}
