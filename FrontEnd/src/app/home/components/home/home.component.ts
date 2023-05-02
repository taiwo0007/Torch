import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {HostService} from "../../../host/services/host.service";
import {TopHostsCardDto} from "../../../host/models/top-hosts-card.dto";
import {delay} from "rxjs";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {LoadingService} from "../../../shared/services/loading.service";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {EscooterService} from "../../../escooter/services/escooter.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAuthenticated = false;
  topHostsInfo:TopHostsCardDto[];
  ratingList:any[] = [];
  featuredScooters:Escooter[] = []
  private tripEnd: any;
  private tripStart: any;
  private location: any;


  constructor(private authService: AuthService, private hostService:HostService, private router:Router, private route:ActivatedRoute,
  private loadingSerivce:LoadingService, private esccoterService:EscooterService) { }

  ngOnInit(): void {

    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )
    this.initMap();
    this.getHostsFromApi();


    this.route.queryParams.subscribe(data => {
      if (data['isLoggedIn']) {
        this.authService.saveLocalVerifyInfo()

        this.loadingSerivce.isSuccess.next({message: 'You have successfully logged in'})

        this.loadingSerivce.isLoading.next(false);
      }
    })

    this.getFeaturedScooters()
  }

  navigateToScooterResults(){
    const queryParams = { tripStart: '',
      tripEnd: '',
      location: ''
    }

    this.router.navigate(['/results'],{ queryParams});

  }

  getFeaturedScooters(){

    this.esccoterService.getFeaturedScooterAds().subscribe((data:Escooter[]) => {
      if(data.length > 4){
        this.featuredScooters = data.slice(0,4);
        console.log(this.featuredScooters);
      }
      else{
        this.featuredScooters = data;
        console.log(this.featuredScooters);

      }
    })

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
