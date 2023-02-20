import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoginRequestPayload} from "../../payloads/login-request.payload";
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isSuccessLogOut = params['success'];
      this.isForbiddenNotice = params['loginNotice'];

      console.log(this.isSuccessLogOut)
    }, error1 => {
      console.log("error", error1)
    })
  }

  onSubmit(authForm: NgForm) {

    this.error = null;
    this.isLoading = true;
    if(!authForm.valid){
      return
    }

    this.loginRequestPayload.email = authForm.value.email;
    this.loginRequestPayload.password = authForm.value.password;

    console.log(this.loginRequestPayload.email)
    console.log(this.loginRequestPayload.password)

    this.authService.login(this.loginRequestPayload).subscribe((data:boolean) => {
      this.isLoading = false;

      this.router.navigate(['/'])
    },
      error => {
        console.log(error)
        this.isLoading = false;
        if(error.error.message){
          this.error = error.error.message;
        }
        else{
          this.error = "An unexpected Error has occurred"

        }

      },
        ()=>{
          this.isLoading = false;

        })
  }


}
