import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import {User} from "../../../user/models/user.model";
import {UserService} from "../../../user/services/user.service";
import {UserData} from "../../../user/models/user-data.model";
import {LoadingService} from "../../services/loading.service";
import {DialogService} from "../../services/dialog.service";
import {VerificationDialogComponent} from "../verification-dialog/verification-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SubscriptionModalComponent} from "../../../user/components/subscription-modal/subscription-modal.component";


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild(BsDropdownDirective, { static: false }) dropdown: BsDropdownDirective;
  isAuthenticated = false;
  isSuccessLogOut = false;

  isHost:boolean;

  isVerified:boolean = false;
  isLoading = false;
  hostID:number;
  profileImage:string;
  accountType:string;

  constructor(private authService: AuthService,
              private router:Router,
              private route: ActivatedRoute,
              private dropdownService: BsDropdownDirective,
              private userService:UserService,
              private loadingService:LoadingService,
              private dialog:MatDialog) {
    this.dropdown = dropdownService;

  }

  ngOnInit(): void {

    this.loadingService.isLoading.subscribe(value => {
      this.isLoading = value;
    })

    this.authService.user.subscribe((data:any) => {

      this.userService.fetchUserDetails().subscribe((userData:UserData) => {
        this.profileImage = userData.profilePicture;
      })

      this.accountType =  data._accountType;

      this.isVerified = data._isVerified;
      this.isHost = data.isHost

      if(!data){
        this.isAuthenticated = false;
      }
      else {
        this.isAuthenticated = true;
      }

      this.hostID = data.hostID;


    })



  }
  ngOnDestroy() {
  }

  onLogout() {
    this.isAuthenticated =false;
    this.isHost = null;
    this.isVerified = null;
    this.hostID = null;
    this.accountType = null;
    this.authService.logout();
    this.router.navigate(['login'], { queryParams: { success: true } });

  }

  closeDropdown(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dropdown.isOpen = false;
  }

    subscriptionModal() {
        const dialogRef = this.dialog.open(SubscriptionModalComponent, {
          height: '620px',
          width: '1200px',
        });


    }
}
