import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {HostService} from "../../../host/services/host.service";
import {TopHostsCardDto} from "../../../host/models/top-hosts-card.dto";
import {delay} from "rxjs";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAuthenticated = false;
  topHostsInfo:TopHostsCardDto[];
  ratingList:any[] = [];
  private tripEnd: any;
  private tripStart: any;
  private location: any;


  constructor(private authService: AuthService, private hostService:HostService, private router:Router) { }

  ngOnInit(): void {

    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )
    this.initMap();
    this.getHostsFromApi();

  }

  navigateToScooterResults(){
    const queryParams = { tripStart: '',
      tripEnd: '',
      location: ''
    }

    this.router.navigate(['/results'],{ queryParams});

  }

  initMap() {

    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById("country"), {

      componentRestrictions : {'country': ['ie']},
      fields: ['geometry', 'name'],
      types: ['establishment']
    })

    console.log(autocomplete)

  }

  getHostsFromApi(){

    this.hostService.fetchAllHosts()
        .pipe(delay(3000))
        .subscribe((data:TopHostsCardDto[]) => {


      this.topHostsInfo = data;
      console.log(this.topHostsInfo)
      this.initRatingList()
    })



  }

   initRatingList() {

    let tempList = []

    for(let l of this.topHostsInfo){
      for(let i = 0; i < l.rating; i++){
        tempList.push(1)
      }
      this.ratingList.push(tempList)

      console.log(this.ratingList)

      tempList = []
    }

    console.log(this.ratingList)

  }
}
