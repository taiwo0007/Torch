import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  isSuccessLogOut = false;

  constructor(private authService: AuthService,
              private router:Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )



  }
  ngOnDestroy() {
  }

  onLogout() {
    this.authService.logout();

    this.router.navigate(['login'], { queryParams: { success: true } });
  }
}
