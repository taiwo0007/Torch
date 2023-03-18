import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Escooter} from "../../models/escooter.interface";
import {delay, map, Subject} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {ImageModule} from 'primeng/image';

@Component({
  selector: 'app-escooter-detail',
  templateUrl: './escooter-detail.component.html',
  styleUrls: ['./escooter-detail.component.css']
})
export class EscooterDetailComponent implements OnInit, AfterViewInit, AfterContentInit {

  paramId: number;
  isLoading = false;
  escooter: Escooter;
  ratingArray:number[];
  markerPosition:google.maps.LatLngLiteral;
  isAuthenticated = false;
  options:google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions = {draggable: false, icon: 'assets/images/website/icons/markerChanged.png'};


  constructor(private escooterService: EscooterService,
              private route:ActivatedRoute,
              private authService: AuthService,
              private router:Router) { }

  ngOnInit(): void {

    this.route.params.subscribe( params => {
      this.paramId = params['id'];

    })


    this.isLoading = true;
      this.escooterService.getEscooterById(this.paramId).pipe(delay(3000)).subscribe( escooterData => {
        this.isLoading = false;
      this.escooter = escooterData;
        this.configureMapOptions();
        this.configureMarker();
      console.log(escooterData)
      this.ratingArray = Array(Math.trunc(escooterData.rating)).fill(0).map((x,i)=>i)

      console.log("Escooter Data"+this.escooter)



    }, error => {
        this.isLoading = false;
        this.router.navigate(['../error'])
      })
    console.log(this.ratingArray)
    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )


    this.escooterService.EscooterChangeEmitter.subscribe(() => {

      this.escooterService.getEscooterById(this.paramId)
          .subscribe( escooterData => {
        this.escooter = escooterData;
            this.isLoading = false;

        this.ratingArray = Array(escooterData.rating).fill(0).map((x,i)=>i)
      })

    })
  }

  ngAfterViewInit() {

  }

  ngAfterContentInit() {
    this.initMap()

  }

  initMap() {
    var location = { lat: 53.410980, lng: -6.400090 }
    var options = {

      center: location,
      zoom: 15
    }

    const map = new google.maps.Map(document.getElementById("map"), options)

    new google.maps.Marker({
      position: location,
      map,
      title: "Hello World!",
      icon: "assets/images/website/icons/markerChanged.png"
    });
  }

  configureMapOptions(){
    console.log(+this.escooter?.longitude)
  this.options = {
      center: {lat: +this.escooter?.latitude, lng: +this.escooter?.longitude},
      zoom: 15
    };
  }

  configureMarker(){
    console.log(+this.escooter?.longitude)


    this.markerPosition = {lat: +this.escooter?.latitude, lng: +this.escooter?.longitude}
  }

}
