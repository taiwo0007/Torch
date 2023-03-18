import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LoginRequestPayload} from "../payloads/login-request.payload";
import {BehaviorSubject, catchError, map, Observable, throwError} from "rxjs";
import {LoginResponsePayload} from "../payloads/login-response.payload";
import {environment} from "../../../environments/environment";
import {User} from "../../user/models/user.model";
import {Router} from "@angular/router";
import {SignupRequestPayload} from "../payloads/signup-request.payload";
import {VerifyRequestPayload} from "../payloads/verify-request.payload";
import {VerificationDialogComponent} from "../../shared/components/verification-dialog/verification-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<any>(null);
  isVerifiedConsent = new BehaviorSubject<any>(false);
  private tokenExpirationTimer: any;
  isLogin:boolean;

  constructor(private http: HttpClient,
            private router:Router, public dialog: MatDialog) {
  }

  onVerifyConsent(){
    this.isVerifiedConsent.next(true);
    let tempUserData = JSON.parse(localStorage.getItem('userData' || '{}'))
    tempUserData.isVerifiedConsent = true;
    localStorage.setItem('userData', JSON.stringify(tempUserData));
    this.user.next(tempUserData)
  }

  saveLocalVerifyInfo(){
    this.isVerifiedConsent.next(true);
    let tempUserData = JSON.parse(localStorage.getItem('userData' || '{}'))
    tempUserData._isVerified = true;
    localStorage.setItem('userData', JSON.stringify(tempUserData));
    this.user.next(tempUserData)

  }

  saveHostDetailsLocaly(id:number){
    let tempUserData = JSON.parse(localStorage.getItem('userData' || '{}'))
    tempUserData._hostID = id;
    tempUserData._isHost = true;
    localStorage.setItem('userData', JSON.stringify(tempUserData));
    this.user.next(tempUserData)

    console.log(tempUserData);
  }



  login(loginRequestPayload: LoginRequestPayload): Observable<boolean>{
    return this.http.post<LoginResponsePayload>(environment.appUrl + '/api/auth/login',loginRequestPayload)
        .pipe(catchError(this.handleError),
            map((data:any) => {
      console.log(data);
      this.isLogin = true;
      this.user.next(this.storeLocalData(data));

      return true;
    }))


  }


  signup(signupRequestPayload:SignupRequestPayload){
    return this.http.post<LoginResponsePayload>(environment.appUrl + '/api/auth/signup', signupRequestPayload).pipe( map(data => {
      console.log(data)
      this.isLogin = false;
      this.user.next(this.storeLocalData(data));

      return true;
    }))
  }

  handleError(errorRes:HttpErrorResponse){

    return throwError(errorRes);
  }


  autoLogout(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)

    console.log(this.tokenExpirationTimer)

  }

  autoLogin(){
    let data:string = 'userData'
      const userData: {email:string, _token:string, _isHost:boolean, _tokenExpirationDate,
                      _isVerified:boolean, _hostID:number, isVerifiedConsent:boolean, _accountType:string
      } = JSON.parse(localStorage.getItem(data) || '{}');

    console.log(userData)

    if(!userData){
      return
    }

    const loadedUser = new User(
      userData.email,
      userData._token,
        userData._isHost,
        userData._tokenExpirationDate,
        userData._isVerified,
        userData._hostID,
        userData.isVerifiedConsent,
        userData._accountType
    );

    console.log(loadedUser)
    if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(loadedUser.tokenExpireDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
    }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');

    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

    storeLocalData(loginResponsePayload: LoginResponsePayload){


    const user = new User( loginResponsePayload.email, loginResponsePayload.authToken, loginResponsePayload.isHost,
        new Date(loginResponsePayload.expiresAt), loginResponsePayload.isVerified,  loginResponsePayload.hostID,  false, loginResponsePayload.accountType);

    localStorage.setItem('userData', JSON.stringify(user));
    console.log(user)
    return user;
  }

  verfyUserViaAPI(verifyRequestPayload: VerifyRequestPayload){
    return this.http.post(environment.appUrl + '/api/auth/verify', verifyRequestPayload);
  }

  openDialog() {
    const dialogRef = this.dialog.open(VerificationDialogComponent, {
      height: '630px',
      width: '600px',
    });
  }


}
