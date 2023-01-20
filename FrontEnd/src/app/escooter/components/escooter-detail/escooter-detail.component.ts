import { Component, OnInit } from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute} from "@angular/router";
import {Escooter} from "../../models/escooter.interface";

@Component({
  selector: 'app-escooter-detail',
  templateUrl: './escooter-detail.component.html',
  styleUrls: ['./escooter-detail.component.css']
})
export class EscooterDetailComponent implements OnInit {

  paramId: number;
  escooter: Escooter;
  ratingArray:number[];

  constructor(private escooterService: EscooterService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe( params => {

     console.log(params['id'])
      this.paramId = params['id'];

    })

    this.escooterService.getEscooterById(this.paramId).subscribe( escooterData => {
      this.escooter = escooterData;
      console.log(escooterData)

      this.ratingArray = Array(escooterData.rating).fill(0).map((x,i)=>i)
    })



  }

}
