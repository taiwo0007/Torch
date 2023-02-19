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
  private tokenExpirationTimer: any;

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
      console.log(data)
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
                      _isVerified:boolean, _hostID:number
      } = JSON.parse(localStorage.getItem(data) || '{}');

    if(!userData){
      return
    }

    const loadedUser = new User(
      userData.email,
      userData._token,
        userData._isHost,
        userData._tokenExpirationDate,
        userData._isVerified,
        userData._hostID
    );

    console.log(loadedUser)
    if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(loadedUser.tokenExpireDate).getTime() - new Date().getTime();
        console.log('token Expire Date',new Date(loadedUser.tokenExpireDate))
      console.log('todays date', new Date())
        console.log(expirationDuration)
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


    this.router.navigate(['login'], { queryParams: { success: true } });

  }


  storeLocalData(loginResponsePayload: LoginResponsePayload){
    console.log(loginResponsePayload);

    const user = new User( loginResponsePayload.email, loginResponsePayload.authToken, loginResponsePayload.isHost,
        new Date(loginResponsePayload.expiresAt), loginResponsePayload.isVerified, loginResponsePayload.hostID);

    localStorage.setItem('userData', JSON.stringify(user));
    return user;
  }



}
