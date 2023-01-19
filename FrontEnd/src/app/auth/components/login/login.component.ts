import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoginRequestPayload} from "../../payloads/login-request.payload";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isSuccessLogOut = false;
  loginRequestPayload: LoginRequestPayload = {
    email: '',
    password: ''
  };
  error = null;
  isLoading = false;


  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isSuccessLogOut = params['success'];

      console.log(this.isSuccessLogOut)
    }, error1 => {
      console.log("error", error1)
    })
  }

  onSubmit(authForm: NgForm) {

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
      error1 => {

      this.isLoading = false;

      console.log(error1)
      })
  }


}
