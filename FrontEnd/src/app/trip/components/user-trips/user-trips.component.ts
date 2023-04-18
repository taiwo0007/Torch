import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../../../user/services/user.service";
import {UserData} from "../../../user/models/user-data.model";
import {Trip} from "../../models/trip";
import {LoadingService} from "../../../shared/services/loading.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-user-trips',
  templateUrl: './user-trips.component.html',
  styleUrls: ['./user-trips.component.css']
})
export class UserTripsComponent implements OnInit, AfterViewInit {
  tripUser:UserData | undefined;
  trips:Trip[];
    isLoading: boolean = false;
  constructor(private userService:UserService, private loadingService:LoadingService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadingService.isLoading.next(true);
  }

  ngAfterViewInit() {
    // this.loadingService.isLoading.next(true)
    // this.isLoading = true;
    this.getUserDetails();
  }

  getUserDetails(){
    this.userService.fetchUserDetails().subscribe((userResponseData:UserData) => {
      console.log(userResponseData.renterTrips[0].user)
      this.tripUser = userResponseData
      this.trips = userResponseData.renterTrips;
      this.loadingService.isLoading.next(false)
      this.isLoading = false;
    }, ()=> {
      this.loadingService.isLoading.next(false)
      this.isLoading = false;
    },
        () => {
          this.isLoading = false;

          this.loadingService.isLoading.next(false)
        } )
  }








}
