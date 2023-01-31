import { Component, OnInit } from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-escooter-results',
  templateUrl: './escooter-results.component.html',
  styleUrls: ['./escooter-results.component.css']
})
export class EscooterResultsComponent implements OnInit {

  escooterResults:any[] = [];
  options:google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerStatus: string = "assets/images/website/icons/marker.png";

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
            console.log(this.escooterResults);
            this.configureMapOptions();
            this.configureAllMarkers()

          }, error => {
              this.escooterResults = null;
          })
    })
  }

    configureMapOptions(){
        console.log(+this.escooterResults[0].longitude)
        this.options = {
            center: {lat: +this.escooterResults[0].latitude, lng: +this.escooterResults[0].longitude},
            zoom: 12
        };
    }

    configureAllMarkers(){

      for(let i of this.escooterResults){

          this.markerPositions.push({
          lat: i.latitude, lng: i.longitude
          })


      }
    }

    addHighlight() {
      console.log("highlighintg")

      this.markerStatus = 'assets/images/website/icons/markerChanged.png'

    }

    removeHighlight() {
        console.log("not highlighintg")

        this.markerStatus = 'assets/images/website/icons/marker.png'
    }
}
