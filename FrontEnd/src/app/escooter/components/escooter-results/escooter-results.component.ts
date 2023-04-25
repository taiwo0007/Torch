import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {delay} from "rxjs";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-escooter-results',
  templateUrl: './escooter-results.component.html',
  styleUrls: ['./escooter-results.component.css']
})
export class EscooterResultsComponent implements OnInit, AfterViewInit {


    searchText: string;
    isFiltering:boolean = false;
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
    isSpeed10to15 = false;
    isSpeed16to20 = false;
    isSpeed21to25 = false;
    isSpeed26Plus = false;

    //Filter Methods
    isMiles10to15: boolean;
    isMiles21to25: boolean;
    isMiles16to20: boolean;
    isMiles26Plus: boolean;

  priceFilterCriteria:any[] = [];
  makeFilterCriteria:any[] = [];
  maxWeightFilterCriteria:any[] = [];
  speedFilterCriteria:any[] = [];
    milesFilterCriteria:any[] = [];

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
              private route: ActivatedRoute, private loadingService:LoadingService,
              private router:Router) { }

  ngOnInit(): void {

      this.loadingService.isRemoveFooter.next(true);
      this.loadingService.isLoadingLine.next(true)


      this.route.queryParams.subscribe(paramValue => {

      this.escooterService.searchEscooter(
          paramValue['tripStart'],
          paramValue['tripEnd'],
          paramValue['location'])
          .subscribe((data: any[]) => {
                  this.loadingService.isLoadingLine.next(false)

                  this.isLoading = false;
            this.escooterResults = data;
            this.escooterResultsFilterCopy = data;
            console.log(this.escooterResults)
                  this.initMap();

          }, error => {
              this.escooterResults = null;
                  this.loadingService.isLoadingLine.next(false)
                    this.router.navigate(['/error'])
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

        for (var i = 0; i < eList.length; i++) {

            //Adds in a marker on the map
            // @ts-ignore
            let tempMarker = new google.maps.Marker({ map: map, id: eList[i].modelName , position: {
                    lat: eList[i].latitude,
                    lng: eList[i].longitude
                }, icon: "assets/images/website/icons/marker.png" });


            markers.push(tempMarker);

        }

        eList.forEach((escooter) => {

            var myContent = `<a href="/escooter-detail/${escooter.id}"><div  class="nav-link" style="width: 9rem; padding: 0.3rem 0 0 0.3rem; text-decoration: none !important; ;"> <img style="" src="${escooter.image}" class="card-img-top rounded-0" alt="..."><div style="padding:0rem 0rem 0rem 0rem !important;" class="card-body  text-info"><h5 style="margin:0 !important;" class="card-title pt-2 fw-bold text-center"><span>€</span>${Number(escooter.cost).toFixed(2)}</h5> </div> </div></a> `;
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
    }




    toggleFilter(filterValue:string){

        this.isLoading = true;

      //PRICES


      if(filterValue == '1to10'){
          //on and off button
          this.is1to10 = !this.is1to10;
          //if on push to price filter list else remove it
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


        // SCOOTER - SPEED
        if(filterValue == 'speed10to15'){
            this.isSpeed10to15 = !this.isSpeed10to15;
            this.isSpeed10to15 ? this.speedFilterCriteria.push(filterValue) : this.speedFilterCriteria.splice(this.speedFilterCriteria.indexOf(filterValue),1) ;
        }

        if(filterValue == 'speed16to20'){
            this.isSpeed16to20 = !this.isSpeed16to20;
            this.isSpeed16to20 ? this.speedFilterCriteria.push(filterValue) : this.speedFilterCriteria.splice(this.speedFilterCriteria.indexOf(filterValue),1) ;
        }
        if(filterValue == 'speed21to25'){
            this.isSpeed21to25 = !this.isSpeed21to25;
            this.isSpeed21to25 ? this.speedFilterCriteria.push(filterValue) : this.speedFilterCriteria.splice(this.speedFilterCriteria.indexOf(filterValue),1) ;
        }
        if(filterValue == 'speed26Plus'){
            this.isSpeed26Plus = !this.isSpeed26Plus;
            this.isSpeed26Plus ? this.speedFilterCriteria.push(filterValue) : this.speedFilterCriteria.splice(this.speedFilterCriteria.indexOf(filterValue),1) ;
        }


        // SCOOTER - MILES
        if(filterValue == 'miles10to15'){
            this.isMiles10to15 = !this.isMiles10to15;
            this.isMiles10to15 ? this.milesFilterCriteria.push(filterValue) : this.milesFilterCriteria.splice(this.milesFilterCriteria.indexOf(filterValue),1) ;
        }

        if(filterValue == 'miles16to20'){
            this.isMiles16to20 = !this.isMiles16to20;
            this.isMiles16to20 ? this.milesFilterCriteria.push(filterValue) : this.milesFilterCriteria.splice(this.milesFilterCriteria.indexOf(filterValue),1) ;
        }
        if(filterValue == 'miles21to25'){
            this.isMiles21to25 = !this.isMiles21to25;
            this.isMiles21to25 ? this.milesFilterCriteria.push(filterValue) : this.milesFilterCriteria.splice(this.milesFilterCriteria.indexOf(filterValue),1) ;
        }
        if(filterValue == 'miles26Plus'){
            this.isMiles26Plus = !this.isMiles26Plus;
            this.isMiles26Plus ? this.milesFilterCriteria.push(filterValue) : this.milesFilterCriteria.splice(this.milesFilterCriteria.indexOf(filterValue),1) ;
        }



        this.applyFilter();
    }

    applyFilter(){
      this.isLoading = true;
      this.loadingService.isLoadingLine.next(true)

      //set up lists we need all filter lists
      this.escooterResults = [];
      this.escooterFilterResults = [];
      this.escooterPriceResults = [];
      let escooterMakeResults = [];
      let escooterMaxWeightResults = [];
      let escooterSpeedResults = [];
      let escooterMilesResults = [];


      //Get the price lists do checks if any filter in the list
        //e.g 1 - 10 filter
        //
        //price filtering
        //copy never changed, keeps source of truth
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
                //dont return results that dont meet these criteria even if they are in price
                return false;
            }
            else {
                return true;
            }
        })

        //make filtering
        escooterMakeResults = this.escooterPriceResults.filter((e) => {

            //then we take the price filter list and filter that wit aditional

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

                return false;
            }
            else {

                return true;
            }
        })

        //weight filtering
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

        //speed filtering
        escooterSpeedResults = escooterMaxWeightResults.filter((e) => {

            if(this.speedFilterCriteria.length > 0) {
                for (let speedFilter of this.speedFilterCriteria) {

                    if (speedFilter == 'speed10to15') {
                        if (e.maxSpeed >= 10 && e.maxSpeed <= 15) {
                            return true;
                        }
                    }
                    if (speedFilter == 'speed16to20') {
                        if (e.maxSpeed >= 16 && e.maxSpeed <= 20) {
                            return true;
                        }
                    }
                    if (speedFilter == 'speed21to25') {
                        if (e.maxSpeed >= 21 && e.maxSpeed <= 25) {
                            return true;
                        }
                    }
                    if (speedFilter == 'speed26Plus') {
                        if (e.maxSpeed >= 26) {
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

        //miles filtering
        escooterMilesResults = escooterSpeedResults.filter((e) => {

            if(this.milesFilterCriteria.length > 0) {
                for (let milesFilter of this.milesFilterCriteria) {

                    if (milesFilter == 'miles10to15') {
                        if (e.maxRange >= 10 && e.maxRange <= 15) {
                            return true;
                        }
                    }
                    if (milesFilter == 'miles16to20') {
                        if (e.maxRange >= 16 && e.maxRange <= 20) {
                            return true;
                        }
                    }
                    if (milesFilter == 'miles21to25') {
                        if (e.maxRange >= 21 && e.maxRange <= 25) {
                            return true;
                        }
                    }
                    if (milesFilter == 'miles26Plus') {
                        if (e.maxRange >= 26) {
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
        this.escooterFilterResults.push(...escooterMilesResults)
        if(this.escooterFilterResults.length != 0){
            this.isFiltering = true
        }
        else {
            this.isFiltering = false;
        }
        //change page results to equal filterd
        this.escooterResults = this.escooterFilterResults;
        setTimeout(()=>{
            this.isLoading = false;
            this.loadingService.isLoadingLine.next(false)

        },500 )

        //init the map again
        this.initMap();
    }
}
