import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EscooterService {
  tripStartParam: Date = new Date();
  tripEndParam: Date = new Date();




  constructor(private http: HttpClient) {}


  searchEscooter(tripStart:any, tripEnd:any, location: any){

    return this.http.get(environment.appUrl +'/api/escooter/findescooters',
        {
          params: new HttpParams()
              .set('tripStart', tripStart)
              .set('tripEnd', tripEnd)
              .set('location', location)
        }
        )
  }
}
