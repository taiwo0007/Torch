import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TripCreateRequestPayload} from "../models/trip-create-request.payload";

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
      private http:HttpClient
  ) { }




  createNewTrip(tripCreateRequestPayload:TripCreateRequestPayload){

    return this.http.post(environment.appUrl+'/api/trips/create-new-trip', tripCreateRequestPayload)
  }

  fetchTripDetailsFromApi(id:number){
    return this.http.get(environment.appUrl+'/api/trips/trip-detail/'+id)
  }

  completeTripFromApi(id:number){
    return this.http.put(environment.appUrl+'/api/trips/complete-trip/'+id, null)

  }

  cancelTripFromApi(id: number) {
    return this.http.put(environment.appUrl+'/api/trips/cancel-trip/'+id, null)
  }
}
