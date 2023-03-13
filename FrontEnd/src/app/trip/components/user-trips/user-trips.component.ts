import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../../../user/services/user.service";
import {UserData} from "../../../user/models/user-data.model";
import {Trip} from "../../models/trip";

@Component({
  selector: 'app-user-trips',
  templateUrl: './user-trips.component.html',
  styleUrls: ['./user-trips.component.css']
})
export class UserTripsComponent implements OnInit, AfterViewInit {
  tripUser:UserData | undefined;
  trips:Trip[];
  constructor(private userService:UserService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getUserDetails();
  }

  getUserDetails(){
    this.userService.fetchUserDetails().subscribe((userResponseData:UserData) => {
      console.log(userResponseData.renterTrips[0].user)
      this.tripUser = userResponseData
      this.trips = userResponseData.renterTrips;
    })
  }








}
