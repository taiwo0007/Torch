import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {EscooterService} from "../../../escooter/services/escooter.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  tripStart:any;
  tripEnd:any;
  location:any;

  constructor(private escooterService: EscooterService,
              private router: Router) { }

  ngOnInit(): void {

    this.initMap();
  }

    onSubmit(searchForm: NgForm) {

    this.tripStart = searchForm.value.tripStart
      this.tripEnd = searchForm.value.tripEnd
      this.location = searchForm.value.location

      const queryParams = { tripStart: this.tripStart,
        tripEnd: this.tripEnd,
        location: this.location}

      this.router.navigate(['results'],
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
}
