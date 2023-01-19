import { Component, OnInit } from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-escooter-results',
  templateUrl: './escooter-results.component.html',
  styleUrls: ['./escooter-results.component.css']
})
export class EscooterResultsComponent implements OnInit {

  escooterResults:any[] = []

  constructor(private escooterService: EscooterService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.route.queryParams.subscribe(paramValue => {
      console.log(paramValue[''])

      this.escooterService.searchEscooter(
          paramValue['tripStart'],
          paramValue['tripEnd'],
          paramValue['location'])
          .subscribe((data: any[]) => {
            this.escooterResults = data
            console.log(this.escooterResults)
          })
    })


  }

}
