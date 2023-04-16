import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Escooter} from "../../escooter/models/escooter.interface";
import {Make} from "../../escooter/models/make.interface";
import {ScooterAddRequestPayload} from "../payload/scooter-add-request.payload";
import {catchError, forkJoin, map, of, switchMap, throwError} from "rxjs";
import {Host} from "../models/host.interface";
import {AuthService} from "../../auth/services/auth.service";
import {CreateAdRequestPayload} from "../payload/create-ad-request.payload";
import {UserData} from "../../user/models/user-data.model";
import {UserService} from "../../user/services/user.service";
import {TopHostsCardDto} from "../models/top-hosts-card.dto";
import {Insurance} from "../models/insurance.interface";


@Injectable({
  providedIn: 'root'
})
export class HostService {


  constructor(private http: HttpClient,
              private authService:AuthService,
              private userService:UserService) { }


  getHostById(id:number){
    return this.http.get(environment.appUrl+'/api/host/host-details/'+id)
  }
  fetchHostDataByUserToken(){
    return this.http.get(environment.appUrl+'/api/host/host-data');
  }
  fetchHostEscooters(id:number){
    return this.http.get<Escooter[]>(environment.appUrl+'/api/host/scooter-list/'+id);
  }

  fetchAllMakes(){
    return this.http.get<Make[]>(environment.appUrl+'/api/host/makes');
  }



  fetchAllHosts() {
      return this.http.get<TopHostsCardDto[]>(environment.appUrl+'/api/host/top')
  }

    fetchAllHostsInsurance() {
        return this.http.get<Insurance[]>(environment.appUrl+'/api/host/insurance-list')
    }
  createEscooter(scooterAddRequestPayload:ScooterAddRequestPayload){
    return this.http.post(environment.appUrl+'/api/host/add-escooter',scooterAddRequestPayload);
  }
  createHostFromAPI(insuranceId:number){
    return this.http.post(environment.appUrl+'/api/host/make-user-host/'+insuranceId, null)
        .pipe(catchError(this.handleError),
            map((data:Host) => {
                console.log(data)
                this.authService.saveHostDetailsLocaly(data.id);
                return data.id;
        }))
  }

  createAd(createAdRequest:CreateAdRequestPayload){
      return this.http.put(environment.appUrl+'/api/host/create-ad',
          {
              ...createAdRequest
          })
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
