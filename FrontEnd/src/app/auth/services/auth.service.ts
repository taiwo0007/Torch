import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LoginRequestPayload} from "../payloads/login-request.payload";
import {BehaviorSubject, catchError, map, Observable, throwError} from "rxjs";
import {LoginResponsePayload} from "../payloads/login-response.payload";
import {environment} from "../../../environments/environment";
import {User} from "../../user/models/user.model";
import {Router} from "@angular/router";
import {SignupRequestPayload} from "../payloads/signup-request.payload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<any>(null);


  constructor(private http: HttpClient,
            private router:Router) {
  }


  login(loginRequestPayload: LoginRequestPayload): Observable<boolean>{
    return this.http.post<LoginResponsePayload>(environment.appUrl + '/api/auth/login',loginRequestPayload)
        .pipe(catchError(this.handleError),
            map((data:any) => {
        console.log(data);
      this.user.next(this.storeLocalData(data));
      return true;
    }))


  }


  signup(signupRequestPayload:SignupRequestPayload){
    return this.http.post<LoginResponsePayload>(environment.appUrl + '/api/auth/signup', signupRequestPayload).pipe( map(data => {
      this.user.next(this.storeLocalData(data));
      return true;
    }))
  }

  handleError(errorRes:HttpErrorResponse){

    return throwError(errorRes);
  }



  autoLogin(){
    let data:string = 'userData'
      const userData: {email:string, _token:string, _isHost:boolean} = JSON.parse(localStorage.getItem(data) || '{}');

    if(!userData){
      return
    }

    const loadedUser = new User(
      userData.email,
      userData._token,
        userData._isHost

    );

    console.log(loadedUser)

    if (loadedUser.token) {
        this.user.next(loadedUser);

        }
    }

  logout() {
    this.user.next(null);

    localStorage.removeItem('userData');

  }
  //
  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email exists already';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exist.';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'This password is not correct.';
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }

  storeLocalData(loginResponsePayload: LoginResponsePayload){
    const user = new User( loginResponsePayload.email, loginResponsePayload.authToken, loginResponsePayload.isHost);

    localStorage.setItem('userData', JSON.stringify(user));
    return user;
  }



}
