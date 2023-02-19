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
    this.authService.user.subscribe((data:User) => {
      console.log(data)
      this.isVerified = data.isVerified;
      this.isHost = data.isHost
      this.isAuthenticated = !!data;
      this.hostID = data.hostID;
      console.log(data)
      console.log(!data)
      console.log(!!data)

    })



  }
  ngOnDestroy() {
  }

  onLogout() {
    this.authService.logout();

  }

  closeDropdown(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dropdown.isOpen = false;
  }
}
