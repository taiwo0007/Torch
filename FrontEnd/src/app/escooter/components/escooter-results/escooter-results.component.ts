import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute} from "@angular/router";
import {delay} from "rxjs";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-escooter-results',
  templateUrl: './escooter-results.component.html',
  styleUrls: ['./escooter-results.component.css']
})
export class EscooterResultsComponent implements OnInit, AfterViewInit {

  //Filter Variables
  is1to10 = false;
  is11to20 = false;
    is21to30 = false
    is31toEnd = false;
    isSegway = false;
    isXioami = false;
    isAvovo = false;
    isPureAir = false;
    isEdisson = false;
    is1to70 = false;
    is71to140 = false;
    is141toEnd = false;

  priceFilterCriteria:any[] = [];
  makeFilterCriteria:any[] = [];
  maxWeightFilterCriteria:any[] = [];

  escooterResults:any[] = [];
  escooterAdsResult:any[] = []
  escooterResultsFilterCopy:any[] = [];
  escooterFilterResults:any[] = [];

  escooterPriceResults:any[] = [];

  options:google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerStatus: string = "assets/images/website/icons/marker.png";
  @ViewChildren("scootercard") cards:QueryList<ElementRef>;
    isLoading: boolean = true;

  constructor(private escooterService: EscooterService,
              private route: ActivatedRoute, private loadingService:LoadingService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(paramValue => {

      this.escooterService.searchEscooter(
          paramValue['tripStart'],
          paramValue['tripEnd'],
          paramValue['location'])
          .subscribe((data: any[]) => {

                  this.isLoading = false;
            this.escooterResults = data;
            this.escooterResultsFilterCopy = data;
            this.configureMapOptions();
            this.configureAllMarkers();

            console.log(this.escooterResults)
                  this.initMap();
                  this.markerEventInit();

          }, error => {
              this.escooterResults = null;

                  this.isLoading = false;
          },
              () => {

              })
    })

      this.getEscooterAdsFromApi();
  }

  getEscooterAdsFromApi(){
      this.escooterService.getAllEscooterAds()

          .subscribe((data:any) => {
          this.escooterAdsResult = data;
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

    //Filter Methods




    toggleFilter(filterValue:string){

      //PRICES


      if(filterValue == '1to10'){

          this.is1to10 = !this.is1to10;
          this.is1to10 ? this.priceFilterCriteria.push(filterValue) : this.priceFilterCriteria.splice(this.priceFilterCriteria.indexOf(filterValue),1) ;

      }

        if(filterValue == '11to20'){

            this.is11to20 = !this.is11to20;
            this.is11to20 ? this.priceFilterCriteria.push(filterValue) : this.priceFilterCriteria.splice(this.priceFilterCriteria.indexOf(filterValue),1) ;

        }

        if(filterValue == '21to30'){

            this.is21to30 = !this.is21to30;
            this.is21to30 ? this.priceFilterCriteria.push(filterValue) : this.priceFilterCriteria.splice(this.priceFilterCriteria.indexOf(filterValue),1) ;

        }

        if(filterValue == '31toEnd'){

            this.is31toEnd = !this.is31toEnd;
            this.is31toEnd ? this.priceFilterCriteria.push(filterValue) : this.priceFilterCriteria.splice(this.priceFilterCriteria.indexOf(filterValue),1) ;

        }

        // BRANDS - MAKES

        if(filterValue == 'xioami'){

            this.isXioami = !this.isXioami;
            this.isXioami ? this.makeFilterCriteria.push(filterValue) : this.makeFilterCriteria.splice(this.makeFilterCriteria.indexOf(filterValue),1) ;

        }
        if(filterValue == 'segway'){

            this.isSegway = !this.isSegway;
            this.isSegway ? this.makeFilterCriteria.push(filterValue) : this.makeFilterCriteria.splice(this.makeFilterCriteria.indexOf(filterValue),1) ;

        }

        if(filterValue == 'avovo'){

            this.isAvovo = !this.isAvovo;
            this.isAvovo ? this.makeFilterCriteria.push(filterValue) : this.makeFilterCriteria.splice(this.makeFilterCriteria.indexOf(filterValue),1) ;

        }

        if(filterValue == 'pure'){

            this.isPureAir = !this.isPureAir;
            this.isPureAir ? this.makeFilterCriteria.push(filterValue) : this.makeFilterCriteria.splice(this.makeFilterCriteria.indexOf(filterValue),1) ;

        }
        if(filterValue == 'edisson'){

            this.isEdisson = !this.isEdisson;
            this.isEdisson ? this.makeFilterCriteria.push(filterValue) : this.makeFilterCriteria.splice(this.makeFilterCriteria.indexOf(filterValue),1) ;

        }

        // MAX USER WEIGHT

        if(filterValue == '1to70'){
            this.is1to70 = !this.is1to70;
            this.is1to70 ? this.maxWeightFilterCriteria.push(filterValue) : this.maxWeightFilterCriteria.splice(this.maxWeightFilterCriteria.indexOf(filterValue),1) ;
        }

        if(filterValue == '71to140'){
            this.is71to140 = !this.is71to140;
            this.is71to140 ? this.maxWeightFilterCriteria.push(filterValue) : this.maxWeightFilterCriteria.splice(this.maxWeightFilterCriteria.indexOf(filterValue),1) ;
        }
        if(filterValue == '141toEnd'){
            this.is141toEnd = !this.is141toEnd;
            this.is141toEnd ? this.maxWeightFilterCriteria.push(filterValue) : this.maxWeightFilterCriteria.splice(this.maxWeightFilterCriteria.indexOf(filterValue),1) ;
        }


      this.applyFilter();
    }

    applyFilter(){
      this.isLoading = true;
      setTimeout(()=>{},1000 )
      this.escooterResults = [];
      this.escooterFilterResults = [];
      this.escooterPriceResults = [];
      let escooterMakeResults = [];
      let escooterMaxWeightResults = [];


        //price filtering
        this.escooterPriceResults = this.escooterResultsFilterCopy.filter((e) => {

            if(this.priceFilterCriteria.length > 0) {

                for (let priceFilter of this.priceFilterCriteria) {

                    if (priceFilter == '1to10') {
                        if (e.cost >= 1 && e.cost <= 10) {
                            return true;
                        }
                    }
                    if (priceFilter == '11to20') {
                        if (e.cost >= 11 && e.cost <= 20) {
                            return true
                        }
                    }
                    if (priceFilter == '21to30') {
                        if (e.cost >= 21 && e.cost <= 30) {
                            return true
                        }
                    }
                    if (priceFilter == '31toEnd') {
                        if (e.cost >= 31) {
                            return true
                        }
                    }
                }
                return false;
            }
            else {
                return true;
            }
        })


        //make filtering
        escooterMakeResults = this.escooterPriceResults.filter((e) => {

            console.log( e.maxWeight)
            if(this.makeFilterCriteria.length > 0) {
                console.log('true')
                for (let makeFilter of this.makeFilterCriteria) {

                    if (makeFilter == 'xioami') {
                        if (e.make.name == 'Xioami') {

                            return true;
                        }
                    }
                    if (makeFilter == 'segway') {
                        if (e.make.name == 'Segway') {

                            return true;
                        }
                    }
                    if (makeFilter == 'avovo') {
                        if (e.make.name == 'Avovo') {

                            return true;
                        }
                    }
                    if (makeFilter == 'pure') {
                        if (e.make.name == 'Pure Air') {

                            return true;
                        }
                    }
                    if (makeFilter == 'edisson') {
                        if (e.make.name == 'Edisson') {

                            return true;
                        }
                    }

                }
                console.log(false)
                return false;
            }
            else {

                return true;
            }
        })


        escooterMaxWeightResults = escooterMakeResults.filter((e) => {

            if(this.maxWeightFilterCriteria.length > 0) {
                console.log(e.maxWeight)
                for (let maxWeightFilter of this.maxWeightFilterCriteria) {

                    if (maxWeightFilter == '1to70') {
                        if (e.maxWeight >= 1 && e.maxWeight <= 70) {
                            return true;
                        }
                    }
                    if (maxWeightFilter == '71to140') {
                        if (e.maxWeight >= 71 && e.maxWeight <= 140) {
                            return true;
                        }
                    }
                    if (maxWeightFilter == '141toEnd') {
                        if (e.maxWeight >= 141) {
                            return true;
                        }
                    }
                }
                console.log(false)
                return false;
            }
            else {

                return true;
            }
        })




        //add all to final list
        this.escooterFilterResults.push(...escooterMaxWeightResults)

        this.isLoading = false;
        this.escooterResults = this.escooterFilterResults;

        //init the map
        this.initMap();
        this.markerEventInit();
    }
}
