import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) { }





  getHostById(id:number){
    return this.http.get(environment.appUrl+'/api/host/'+id)
  }
}
