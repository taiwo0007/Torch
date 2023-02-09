import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Escooter} from "../../escooter/models/escooter.interface";

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) { }

  getHostById(id:number){
    return this.http.get(environment.appUrl+'/api/host/'+id)
  }
  fetchHostDataByUserToken(){
    return this.http.get(environment.appUrl+'/api/host/host-data');
  }
  fetchHostEscooters(){
    return this.http.get<Escooter[]>(environment.appUrl+'/api/host/scooter-list');
  }
}
