import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/services/auth.service";
import {environment} from "../../../environments/environment";
import {BasicUserResponsePayload} from "../models/basic-user-response.payload";
import {switchMap} from "rxjs";
import {StripeService} from "ngx-stripe";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{

  userData: any;


  constructor(
      private http: HttpClient,
      private authService: AuthService,
      private stripeService:StripeService
  ) { }



  ngOnInit() {


  }

  fetchUserDetails(){

    return this.http.get(environment.appUrl + '/api/user/profile')
  }

  createCheckoutSessionFromAPI({price_id, email}){
    return this.http.post(environment.appUrl +'/create-checkout-session', { price_id, email, url: environment.frontEndUrl+'/profile?subscriptionInitiated=true' })
        .pipe(
            switchMap((session:any) => {
              console.log('session')
              console.log(session.id)
              return this.stripeService.redirectToCheckout({ sessionId: session.id })
            })
        );
  }


  fetchBasicUser(id:number){

    return this.http.get<BasicUserResponsePayload>(environment.appUrl+'/api/user/details/'+id);
  }
}
