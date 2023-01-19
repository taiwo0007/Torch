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
  }

    onSubmit(searchForm: NgForm) {





    this.tripStart = searchForm.value.tripStart
      this.tripEnd = searchForm.value.tripEnd
      this.location = searchForm.value.location

      console.log(this.tripStart)

      this.escooterService.searchEscooter(this.tripStart, this.tripEnd, this.location)
          .subscribe(data => {
            console.log(data)
          } )

      this.router.navigate(['results'])


    }
}
