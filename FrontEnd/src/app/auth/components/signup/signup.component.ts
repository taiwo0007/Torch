import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {SignupRequestPayload} from "../../payloads/signup-request.payload";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  error = null;
  signupRequestPayload: SignupRequestPayload = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
  }


  onSubmit(signupForm: NgForm) {
    this.isLoading = true;
    if(!signupForm.valid){
      return
    }

    this.signupRequestPayload.email = signupForm.value.email;
    this.signupRequestPayload.password = signupForm.value.password;
    this.signupRequestPayload.lastName = signupForm.value.lastName;
    this.signupRequestPayload.firstName = signupForm.value.firstName;

    this.authService.signup( this.signupRequestPayload).subscribe((data:boolean) => {
        this.isLoading = false;
        this.router.navigate(['/'])
      },
      error1 => {
        this.isLoading = false;
        console.log(error1)
      })
  }
}
