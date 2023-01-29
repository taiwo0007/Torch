import { Component, OnInit } from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Escooter} from "../../models/escooter.interface";
import {Subject} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-escooter-detail',
  templateUrl: './escooter-detail.component.html',
  styleUrls: ['./escooter-detail.component.css']
})
export class EscooterDetailComponent implements OnInit {

  paramId: number;
  escooter: Escooter;
  ratingArray:number[];
  isAuthenticated = false;



  constructor(private escooterService: EscooterService,
              private route:ActivatedRoute,
              private authService: AuthService,
              private router:Router) { }

  ngOnInit(): void {

    this.route.params.subscribe( params => {
      this.paramId = params['id'];

    })




      this.escooterService.getEscooterById(this.paramId).subscribe( escooterData => {
      this.escooter = escooterData;
      this.ratingArray = Array(escooterData.rating).fill(0).map((x,i)=>i)
      console.log("Escooter Data"+escooterData)
    }, error => {
        this.router.navigate(['../error'])
      })

    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )


    this.escooterService.EscooterChangeEmitter.subscribe(() => {

      this.escooterService.getEscooterById(this.paramId).subscribe( escooterData => {
        this.escooter = escooterData;
        this.ratingArray = Array(escooterData.rating).fill(0).map((x,i)=>i)
      })

    })




  }

}
