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
    isLoading: boolean =false;

  constructor(private userService: UserService,private route:ActivatedRoute,
              private authService: AuthService,
              private toastr: ToastrService,
              private loadingSerivce:LoadingService) { }

    ngAfterContentInit() {
      this.isLoading = true;
        this.userService.fetchUserDetails().subscribe( (data: any) => {
            this.userData = data;

            this.loadingSerivce.isLoading.next(false);
            this.isLoading = false;

            this.route.queryParams.subscribe(data => {
                if(data['success']) {
                    this.authService.saveLocalVerifyInfo()

                    this.loadingSerivce.isNotice.next({message:'Verification email has been sent'})

                    this.loadingSerivce.isLoading.next(false);
                    this.isLoading = false;


                }

                console.log(data['subscriptionInitiated']);
                console.log(this.userData)
                this.loadingSerivce.isLoading.next(false);
                this.isLoading = false;
                this.authService.saveAccountType(this.userData.accountType)

                if(data['subscriptionInitiated']) {
                    if (this.userData.accountType) {
                        this.loadingSerivce.isSuccess.next({message:'Your Subscription is activated'})
                    }
                    else {
                        this.loadingSerivce.isError.next({message:'Your Subscription has not been activated'})

                    }
                    this.loadingSerivce.isLoading.next(false);
                    this.isLoading = false;
                }

                this.loadingSerivce.isLoading.next(false);
                this.isLoading = false;
            })
        })
    }

    ngOnInit(): void {

        this.loadingSerivce.isLoading.next(true);
        this.isLoading = true;



  }

}
