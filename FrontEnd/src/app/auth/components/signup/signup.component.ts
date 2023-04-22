import {Component, ElementRef, DoCheck, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {NgForm, FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {SignupRequestPayload} from "../../payloads/signup-request.payload";
import {AuthService} from "../../services/auth.service";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, DoCheck, AfterViewInit {
  isLoading = false;
  error = null;
  @ViewChild("emailInput", {static: true}) emailInput:ElementRef;
  @ViewChild("password", {static: true}) password:ElementRef;
  @ViewChild("passwordAgain", {static: true}) passwordAgain:ElementRef;

  signupRequestPayload: SignupRequestPayload = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  emailModelInput: any;
  isNoMatch:boolean;

  constructor(private router: Router,
              private authService: AuthService,
              private loadingService:LoadingService) { }

  ngOnInit(): void {
    this.loadingService.isRemoveFooter.next(true);

    if(this.emailModelInput != ''){
      console.log("hello")
    }

  }

  ngAfterViewInit() {
    // console.log(this.password.nativeElement)
    console.log(this.emailInput.nativeElement)

  }

  ngDoCheck() {
      if(this.password.nativeElement.value){
        if(this.passwordAgain.nativeElement.value){
          this.isNoMatch = true;
          this.passwordAgain.nativeElement.style.border = '2px solid red !important';
          if(this.passwordAgain.nativeElement.value == this.password.nativeElement.value){
            this.passwordAgain.nativeElement.style.border = '2px solid green !important';
            this.isNoMatch = false;
          }
        }
      }

  }


  onSubmit(signupForm: NgForm) {
    this.loadingService.isLoadingLine.next(true);

    this.isLoading = true;
    if(!signupForm.valid){
      this.loadingService.isLoadingLine.next(false);

      this.loadingService.isNotice.next({message: 'Please check all fields and try again'})
      this.isLoading = false;
      return
    }
    this.error = null;

    this.signupRequestPayload.email = signupForm.value.email.trim();
    this.signupRequestPayload.password = signupForm.value.password;
    this.signupRequestPayload.lastName = signupForm.value.lastName;
    this.signupRequestPayload.firstName = signupForm.value.firstName;

    this.authService.signup( this.signupRequestPayload).subscribe((data:boolean) => {
        this.isLoading = false;
          this.loadingService.isLoadingLine.next(false);

          this.router.navigate(['/'])
      },
      error => {
        this.isLoading = false;
        this.loadingService.isLoadingLine.next(false);

        this.error = error.error.message;
        if(error.error.message){

          this.emailInput.nativeElement.style.border = '2px solid red'

        }

        this.loadingService.isError.next({message:this.error})

        console.log(this.emailInput.nativeElement)
        console.log(error)


      })
  }
}
