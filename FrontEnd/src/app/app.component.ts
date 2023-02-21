import { Component } from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {MatDialog} from '@angular/material/dialog';
import {VerificationComponent} from "./auth/components/verification/verification.component";
import {VerificationDialogComponent} from "./shared/components/verification-dialog/verification-dialog.component";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'torch-front-end';
  isAuthUrl = false;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(VerificationDialogComponent, {
      height: '630px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.authService.autoLogin();

    this.authService.user.subscribe(userData => {
        if(userData.isVerified == false && userData.isVerifiedConsent == false) {
          console.log("in here")
          console.log(userData.isVerified)
          console.log(userData.isVerifiedConsent)
          this.openDialog()

        }

    },
        () => {
      console.log("not verified")
        })

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        window.scrollTo(0,0);
      }
    })

    this.route.params.subscribe((params) => {
      console.log(params, this.router.url)
      this.router.url
    })
  }



}
