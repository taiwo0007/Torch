import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Escooter} from "../models/escooter.interface";
import {Subject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EscooterService implements OnDestroy{

   hostDetailsEmitter = new Subject();





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

    getEscooterById(id:number){
        return this.http.get<Escooter>(environment.appUrl +'/api/escooter/escooter-detail/'+id)
    }


    ngOnDestroy() {

        this.hostDetailsEmitter.unsubscribe();
    }


}
