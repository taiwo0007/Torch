import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-escooter-results',
  templateUrl: './escooter-results.component.html',
  styleUrls: ['./escooter-results.component.css']
})
export class EscooterResultsComponent implements OnInit, AfterViewInit {

  escooterResults:any[] = [];
  options:google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerStatus: string = "assets/images/website/icons/marker.png";
  @ViewChildren("scootercard") cards:QueryList<ElementRef>;

  constructor(private escooterService: EscooterService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {


    this.route.queryParams.subscribe(paramValue => {

      this.escooterService.searchEscooter(
          paramValue['tripStart'],
          paramValue['tripEnd'],
          paramValue['location'])
          .subscribe((data: any[]) => {
            this.escooterResults = data
            this.configureMapOptions();
            this.configureAllMarkers()

          }, error => {
              this.escooterResults = null;
          },
              () => {
                  this.initMap();
                  this.markerEventInit();
              })
    })
  }

  ngAfterViewInit() {

  }

    configureMapOptions(){
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

      this.markerStatus = 'assets/images/website/icons/markerChanged.png'

    }

    removeHighlight() {

        this.markerStatus = 'assets/images/website/icons/marker.png'
    }

     initMap() {

        var location = {
            lat: 53.358888300000004,
            lng: -6.308530354714592
        }
        var options = {

            center: location,
            zoom: 12,
            mapId: 'wearetorchvinividivici'
        }

        const map = new google.maps.Map(document.getElementById("map"), options);

        let eList = this.escooterResults;

        let escooters = document.getElementsByClassName("scooter-card");
        console.log(escooters)

        let markers = [];

        function changeIcon(markerId) {
            markers.forEach(function(marker) {
                if (marker.id === markerId) {
                    marker.setIcon("assets/images/website/icons/markerChanged.png");
                }
            });
        }

        function resetIcon(markerId) {
            markers.forEach(function(marker) {

                if (marker.id === markerId) {
                    marker.setIcon("assets/images/website/icons/marker.png");
                }
            });
        }
        console.log(markers)

        for (var i = 0; i < eList.length; i++) {

            // @ts-ignore
            let tempMarker = new google.maps.Marker({ map: map, id: eList[i].modelName , position: {
                    lat: eList[i].latitude,
                    lng: eList[i].longitude
                }, icon: "assets/images/website/icons/marker.png" });

            markers.push(tempMarker);

        }

        eList.forEach((escooter) => {

            var myContent = `<a [routerLink]="['../escooter-detail', ${escooter.id}]"><div  class="card" style="width: 6rem; padding: 0.3rem 0 0 0.3rem"> <img style="" src="${escooter.image}" class="card-img-top rounded-0" alt="..."><div style="padding:0rem 0rem 0rem 0rem !important;" class="card-body  text-info"><h5 style="margin:0 !important;" class="card-title pt-2 fw-bold text-center"><span>€</span>${Number(escooter.cost).toFixed(2)}</h5> </div> </div></a> \`;`;
            markers.forEach((elem) => {

                if(escooter.modelName == elem.id){

                    let infowindow = new google.maps.InfoWindow({
                        content: myContent,
                        ariaLabel: "Uluru",
                    });

                    elem.addListener("click", () => {
                        infowindow.open({
                            anchor: elem,
                            map,
                        });
                    });
                }
            })
        })



         setTimeout(()=>{
             Array.from(escooters).forEach(element => {


                 element.addEventListener("mouseover", () => {
                     console.log(element.id)
                     changeIcon(element.id);
                 });

                 element.addEventListener("mouseout", () => {
                     resetIcon(element.id);
                 });


             });
         },0)




        //
        //  escooters.forEach((elem) => {
        //     console.log("hi")
        //     elem.addEventListener("mouseover", () => {
        //         changeIcon(elem.id);
        //     });
        //
        //     elem.addEventListener("mouseout", () => {
        //         resetIcon(elem.id);
        //     });
        // })
    }


    markerEventInit(){

      console.log(this.cards.length)

        this.cards.forEach(element => {
            console.log(element.nativeElement)
        })
    }
}
