import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoginRequestPayload} from "../../payloads/login-request.payload";
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {LoadingService} from "../../../shared/services/loading.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1,
      })),
      state('hide', style({
        opacity: 0,
      })),
      transition('show => hide', animate('1600ms ease-out')),
      transition('hide => show', animate('1600ms ease-in')),

    ])
  ]
})
export class LoginComponent implements OnInit {
  isSuccessLogOut = false;
  loginRequestPayload: LoginRequestPayload = {
    email: '',
    password: ''
  };
  error = null;
  isLoading = false;
isForbiddenNotice: false;


  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private loadingService:LoadingService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      if(params['success']){
        this.loadingService.isSuccess.next({message: 'You have successfully logged out'})
      }
      if(params['loginNotice']){
        this.loadingService.isAlert.next({message: 'You must login to visit this page'})
      }

      console.log(this.isSuccessLogOut)
    }, error1 => {
      console.log("error", error1)
    })
  }

  onSubmit(authForm: NgForm) {
    this.loadingService.isLoadingLine.next(true);

    this.error = null;
    this.isLoading = true;
    if(!authForm.valid){
      this.loadingService.isNotice.next({message: 'Please check all fields and try again'})
      this.loadingService.isLoadingLine.next(false);
      this.isLoading = false;
      return
    }

    this.loginRequestPayload.email = authForm.value.email;
    this.loginRequestPayload.password = authForm.value.password;

    console.log(this.loginRequestPayload.email)
    console.log(this.loginRequestPayload.password)

    this.authService.login(this.loginRequestPayload).subscribe((data:boolean) => {
          this.loadingService.isLoadingLine.next(false);

          this.isLoading = false;

      this.router.navigate(['/'],{queryParams: {isLoggedIn: true}})
    },
      error => {
        console.log(error)
        this.loadingService.isLoadingLine.next(false);

        this.isLoading = false;
        if(error.error.message){
          console.log('this.error.error.message')
          console.log(error.error.message)
          this.error = error.error.message;
          this.loadingService.isError.next({message:'Error! '+ this.error})
          this.isLoading = false;

        }
        else{
          this.loadingService.isError.next({message: 'An unexpected Error has occurred'})
          this.isLoading = false;

        }

      },
        ()=>{
          this.loadingService.isLoadingLine.next(false);

          this.isLoading = false;

        })
  }


}
