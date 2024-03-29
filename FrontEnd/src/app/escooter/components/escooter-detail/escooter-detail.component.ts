import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EscooterService} from "../../services/escooter.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Escooter} from "../../models/escooter.interface";
import {delay, map, Subject, tap} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {ImageModule} from 'primeng/image';
import {LoadingService} from "../../../shared/services/loading.service";
import {Host} from "../../../host/models/host.interface";
import {HostService} from "../../../host/services/host.service";

@Component({
    selector: 'app-escooter-detail',
    templateUrl: './escooter-detail.component.html',
    styleUrls: ['./escooter-detail.component.css']
})
export class EscooterDetailComponent implements OnInit, AfterViewInit, AfterContentInit {

    paramId: number;
    isLoading = false;
    escooter: Escooter;
    ratingArray: number[];
    host:Host;
    markerPosition: google.maps.LatLngLiteral;
    isAuthenticated = false;
    options: google.maps.MapOptions;
    markerOptions: google.maps.MarkerOptions = {
        draggable: false,
        icon: 'assets/images/website/icons/markerChanged.png'
    };
     isHostInit: boolean;


    constructor(private escooterService: EscooterService,
                private route: ActivatedRoute,
                private authService: AuthService,
                private router: Router,
                private hostService:HostService,
                private cdr: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        console.log("0"+this.isLoading)
        this.isLoading = true;
        console.log("1"+this.isLoading)

        this.route.params.subscribe(params => {
            this.paramId = params['id'];
            console.log("2"+this.isLoading)
        });

        this.escooterService.getEscooterById(this.paramId)
            .pipe(
                tap(() => {
                    this.isLoading = true

                    console.log("3"+this.isLoading)
                }),

            )
            .subscribe(escooterData => {
                this.escooter = escooterData;

                this.setHostData();
                this.configureMapOptions();
                this.configureMarker();
                this.ratingArray = Array(Math.trunc(escooterData.rating)).fill(0).map((x, i) => i);
            }, error => {
                this.router.navigate(['/error']);
            }, () => {
                console.log("4"+this.isLoading)
                this.isLoading = false;
            });

        this.authService.user.subscribe((data: boolean) => this.isAuthenticated = data);
    }


    ngAfterViewInit() {
    }

    ngAfterContentInit() {
        this.initMap()
    }

    initMap() {
        var location = {lat: 53.410980, lng: -6.400090}
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

    configureMapOptions() {
        console.log(+this.escooter?.longitude)
        this.options = {
            center: {lat: +this.escooter?.latitude, lng: +this.escooter?.longitude},
            zoom: 15
        };
    }

    configureMarker() {
        console.log(+this.escooter?.longitude)
        this.markerPosition = {lat: +this.escooter?.latitude, lng: +this.escooter?.longitude}
    }



    setHostData() {

        this.hostService.getHostById(this.escooter.host)


            .subscribe((data:Host) => {
                this.host = data;
            }, ()=> {
            }, () => {

            })
    }

    handleHostInit($event: any) {
        this.isHostInit = true;
    }
}
