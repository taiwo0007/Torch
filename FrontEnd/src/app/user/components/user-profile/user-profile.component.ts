import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserData} from "../../models/user-data.Model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData?:UserData;

  constructor(private userService: UserService,) { }

  ngOnInit(): void {

    this.userService.fetchUserDetails().subscribe( (data: any) => {
     this.userData = {
       firstName :data.firstName,
       lastName: data.lastName,
       phoneNumber: data.phoneNumber,
        postCode: data.postCode,
       country: data.country,
         state: data.state,
         email: data.email,
         isVerified: data.isVerified,
         userTrips: data.userTrips,
         rating: data.rating,
         id: data.id,
         isHost: data.isHost
     }

      console.log(this.userData)

    })



  }

}
