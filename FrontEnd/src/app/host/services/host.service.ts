import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Escooter} from "../../escooter/models/escooter.interface";
import {Make} from "../../escooter/models/make.interface";
import {ScooterAddRequestPayload} from "../payload/scooter-add-request.payload";

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

  fetchAllMakes(){
    return this.http.get<Make[]>(environment.appUrl+'/api/host/makes');
  }
  createEscooter(scooterAddRequestPayload:ScooterAddRequestPayload){
    return this.http.post(environment.appUrl+'/api/host/add-escooter',scooterAddRequestPayload);
  }
}
