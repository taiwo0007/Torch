import {Component, Input, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {Host} from "../../models/host.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {daLocale} from "ngx-bootstrap/chronos";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {delay, map} from "rxjs";
import {UserService} from "../../../user/services/user.service";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-host-profile',
  templateUrl: './host-profile.component.html',
  styleUrls: ['./host-profile.component.css']
})
export class HostProfileComponent implements OnInit{

  host?: Host;
  hostEsccoters:Escooter[];
  isMore:boolean;
  isLoading = false;

  constructor(private hostService:HostService,
              private router:Router,
              private route:ActivatedRoute,
              private userService:UserService,
              private loadingService:LoadingService) {



  }


  ngOnInit() {

    this.loadingService.isLoading.next(true);
    console.log("loading")
    this.isLoading = true;

    this.getRouteParmasInitHost();

  }

  //just an ID is being returned for userreviewr - we are calling an api to change it to a userobject
    ratingList: any = [];
  getHostData(paramid:number){

    this.hostService.getHostById(paramid).pipe( map((data:Host) => {
      data.hostReviews.map(hostReviewData => {
        this.userService.fetchBasicUser(hostReviewData.user_reviewer).subscribe(data => {
          console.log(data)
          hostReviewData.user_reviewer = data;
        })
      })
      return data;
    }))
        .subscribe((data:Host) => {
      console.log(data)
        this.host = data

          console.log(this.host)

          this.getHostEsccotersInitEscooters()
              this.initRatingList()
          // this.loadingService.isLoading.next(false);
          this.loadingService.isLoading.next(false);
          this.isLoading = false

        },
            ()=>{
              this.loadingService.isLoading.next(false);
              this.isLoading = false
            })
  }

  getHostEsccotersInitEscooters(){
    return this.hostService.fetchHostEscooters(this.host.id).pipe(map(data => {

      if(data.length > 2){
        this.isMore = true;
        console.log("hell oworld")
        return data.slice(0,2);
      }
      return data;
    }))
     .subscribe((data:Escooter[]) => {

      this.hostEsccoters = data
      console.log(data);

      this.isLoading = false;
       this.loadingService.isLoading.next(false);



     },
         ()=> {
           this.loadingService.isLoading.next(false);
           this.isLoading = false
         })
  }
  getRouteParmasInitHost(){
    this.route.params.subscribe(params => {


      this.getHostData(params['id']);

      console.log(this.hostEsccoters)

    })
  }

  initRatingList() {

    let tempList = []

    for(let l of this.host.hostReviews){
      for(let i = 0; i < l.starRating; i++){
        tempList.push(1)
      }
      this.ratingList.push(tempList)

      console.log(this.ratingList)

      tempList = []
    }

    console.log(this.ratingList)
    console.log("this.ratingList")


  }


}
