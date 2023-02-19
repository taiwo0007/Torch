import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild(BsDropdownDirective, { static: false }) dropdown: BsDropdownDirective;
  isAuthenticated = false;
  isSuccessLogOut = false;

  constructor(private authService: AuthService,
              private router:Router,
              private route: ActivatedRoute,
              private dropdownService: BsDropdownDirective) {
    this.dropdown = dropdownService;

  }

  ngOnInit(): void {
    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )



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
