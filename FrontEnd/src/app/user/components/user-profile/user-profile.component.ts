import {AfterContentInit, Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserData} from "../../models/user-data.model";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";
import {ToastrService} from "ngx-toastr";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterContentInit {
  userData?:UserData;
  isCreatedVerified;

  constructor(private userService: UserService,private route:ActivatedRoute,
              private authService: AuthService,
              private toastr: ToastrService,
              private loadingSerivce:LoadingService) { }

    ngAfterContentInit() {
        this.userService.fetchUserDetails().subscribe( (data: any) => {
            this.userData = data;

            this.loadingSerivce.isLoading.next(false);


            this.route.queryParams.subscribe(data => {
                if(data['success'] && this.userData.isVerified){
                    this.authService.saveLocalVerifyInfo()
                    this.toastr.success(  ' Successfully Verified','', {
                        positionClass: 'toast-top-center'
                    });
                }
                console.log(data['subscriptionInitiated']);
                console.log(this.userData)
                this.authService.saveAccountType(this.userData.accountType)

                if(data['subscriptionInitiated']) {
                    if (this.userData.accountType) {
                        this.toastr.success(this.userData.accountType + ' subscription activated','', {
                          positionClass: 'toast-top-center'
                        });
                    }
                    else {
                        this.toastr.error('Subscription not added');

                    }
                }


            })
        })
    }

    ngOnInit(): void {

        this.loadingSerivce.isLoading.next(true);



  }

}
