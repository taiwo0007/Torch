import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import {User} from "../../../user/models/user.model";


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild(BsDropdownDirective, { static: false }) dropdown: BsDropdownDirective;
  isAuthenticated = false;
  isSuccessLogOut = false;
  isHost:boolean = false;
  isVerified:boolean = false;
  hostID:number;

  constructor(private authService: AuthService,
              private router:Router,
              private route: ActivatedRoute,
              private dropdownService: BsDropdownDirective) {
    this.dropdown = dropdownService;

  }

  ngOnInit(): void {
    this.authService.user.subscribe((data:any) => {
      console.log(data)
      this.isVerified = data._isVerified;
      this.isHost = data.isHost
      if(data == null){
        this.isAuthenticated = false;
      }
      else {
        this.isAuthenticated = true;
      }

      this.hostID = data.hostID;
      console.log(data._isVerified)


    })



  }
  ngOnDestroy() {
  }

  onLogout() {
    this.isAuthenticated =false;
    this.isHost = null;
    this.isVerified = null;
    this.hostID = null;
    this.authService.logout();
    this.router.navigate(['login'], { queryParams: { success: true } });

  }

  closeDropdown(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dropdown.isOpen = false;
  }
}
