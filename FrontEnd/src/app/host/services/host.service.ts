import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Escooter} from "../../escooter/models/escooter.interface";
import {Make} from "../../escooter/models/make.interface";
import {ScooterAddRequestPayload} from "../payload/scooter-add-request.payload";
import {catchError, map, throwError} from "rxjs";
import {Host} from "../models/host.interface";

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) { }

  getHostById(id:number){
    return this.http.get(environment.appUrl+'/api/host/host-details/'+id)
  }
  fetchHostDataByUserToken(){
    return this.http.get(environment.appUrl+'/api/host/host-data');
  }
  fetchHostEscooters(){
    return this.http.get<Escooter[]>(environment.appUrl+'/api/host/scooter-list');
  }

  fetchAllMakes(){
    return this.http.get<Make[]>(environment.appUrl+'/api/host/makes');
  }
  createEscooter(scooterAddRequestPayload:ScooterAddRequestPayload){
    return this.http.post(environment.appUrl+'/api/host/add-escooter',scooterAddRequestPayload);
  }
  createHostFromAPI(){
    return this.http.post(environment.appUrl+'/api/host/make-user-host', null)
        .pipe(catchError(this.handleError),
            map((data:Host) => {
          return data.id;
        }))
  }

   handleError(errorRes:HttpErrorResponse) {
    if(errorRes.status == 403){
        console.log("34345")
        return throwError("You must have a user account to become a host");
    }
    if(errorRes.status == 400){
        console.log("34345")

        return throwError(errorRes);
    }
       console.log("34345")
       return throwError("An Uknown Error has occured");

   }
}
