import { Component } from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VerificationDialogComponent} from "./shared/components/verification-dialog/verification-dialog.component";
import {LoadingService} from "./shared/services/loading.service";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'torch-front-end';
  isAuthUrl = false;
  isLoading = false;
  showCookie:boolean;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private loadingService: LoadingService) {}


  openDialog() {
    const dialogRef = this.dialog.open(VerificationDialogComponent, {
      height: '630px',
      width: '600px',
    });
  }

  onCookieAccept(consent:boolean){
    console.log(consent)
    this.authService.saveCookieConsent(consent);
    this.showCookie = !this.showCookie;
  }

  ngOnInit() {

    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationEnd){
    //     window.scrollTo(0,0);
    //   }
    // })



    this.authService.autoLogin();

    this.showCookie = this.authService.hasShownCookie();

    this.authService.user.subscribe(userData => {
        if(userData.isVerified == false && userData.isVerifiedConsent == false) {
          console.log("in here")
          console.log(userData.isVerified)
          console.log(userData.isVerifiedConsent)


          setTimeout(() => {
            this.authService.openDialog();
          }, 4000)

        }

    },
        () => {
      console.log("not verified")
        })
    this.route.params.subscribe((params) => {
      console.log(params, this.router.url)
      this.router.url
    })
  }



}
