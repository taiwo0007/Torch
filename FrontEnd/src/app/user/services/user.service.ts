import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/services/auth.service";
import {environment} from "../../../environments/environment";
import {BasicUserResponsePayload} from "../models/basic-user-response.payload";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{

  userData: any;


  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) { }



  ngOnInit() {


  }

  fetchUserDetails(){

    return this.http.get(environment.appUrl + '/api/user/profile')
  }


  fetchBasicUser(id:number){

    return this.http.get<BasicUserResponsePayload>(environment.appUrl+'/api/user/details/'+id);
  }
}
