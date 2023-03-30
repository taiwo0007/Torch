import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Escooter} from "../models/escooter.interface";
import {map, Subject, tap} from "rxjs";
import {ScooterReviewRequestPayload} from "../payloads/scooter-review.payload";
import {ScooterReviewer} from "../models/scooter-reviewer.interface";

@Injectable({
  providedIn: 'root'
})
export class EscooterService implements OnDestroy{
    EscooterChangeEmitter = new Subject();

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
    getAllEscooterAds(){
        return this.http.get(environment.appUrl +'/api/escooter/find-escooter-ads'

        ).pipe(map((escooters:any) => {

            console.log(escooters)

            let newList: any = [];

            if(escooters.length == 1){
                return escooters;
            }

            while(newList.length < 2 && escooters.length > 0){
                let randomIndex = Math.floor(Math.random() * escooters.length);
                let randomItem = escooters.splice(randomIndex, 1)[0];
                newList.push(randomItem);
            }
            console.log(newList)

            return newList
        }))
    }

    getEscooterById(id:number){
        return this.http.get<Escooter>(environment.appUrl +'/api/escooter/escooter-detail/'+id).pipe(map(escoterData => {
            escoterData.escooterReviews.sort((a, b) => {
                let dateA = new Date(a.reviewDate)
                let dateB = new Date(b.reviewDate)
                return dateB.getTime() - dateA.getTime();
            })

            console.log(escoterData.escooterReviews)
            return escoterData
        }))
    }

    createReview(scooterReviewRequestPayload: ScooterReviewRequestPayload){
        return this.http.post<ScooterReviewer>(environment.appUrl+'/api/escooter/create-review',{
            ...scooterReviewRequestPayload
        })
    }


    ngOnDestroy() {
    }


}
