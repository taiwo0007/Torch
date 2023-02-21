import {AfterContentInit, Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserData} from "../../models/user-data.model";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterContentInit {
  userData?:UserData;
  isCreatedVerified;

  constructor(private userService: UserService,private route:ActivatedRoute,
              private authService: AuthService) { }

    ngAfterContentInit() {
        this.userService.fetchUserDetails().subscribe( (data: any) => {
            this.userData = data;
            this.route.queryParams.subscribe(data => {
                if(data['success'] && this.userData.isVerified){
                    this.authService.saveLocalVerifyInfo()
                }
            })
        })
    }

    ngOnInit(): void {





  }

}
