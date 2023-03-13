import {Component, OnInit} from '@angular/core';
import {HostService} from "../../services/host.service";
import {HttpClient} from "@angular/common/http";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../user/models/user.model";
import {UserService} from "../../../user/services/user.service";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-host-escooters',
  templateUrl: './host-escooters.component.html',
  styleUrls: ['./host-escooters.component.css']
})
export class HostEscootersComponent implements OnInit{
  hostEscooters:Escooter[];
  addSuccess:boolean = false;
  hostID:number;
  isScooterOwner:boolean = false;

  constructor(private hostService: HostService, private route:ActivatedRoute,
              private authService:AuthService) {
  }

  ngOnInit() {
    this.checkHostID();
    this.checkSuccessUrl();

  }

  getHostEscooters(){
    this.hostService.fetchHostEscooters(this.hostID).subscribe(data => {
      console.log(data)
      this.hostEscooters = data

    })
  }

  checkHostID(){
    this.route.params.subscribe(params => {
      this.hostID = params['id'];
      this.checkScooterOwner();
      this.getHostEscooters();
    })
  }

  checkScooterOwner(){
    this.authService.user.subscribe(thisUser => {
      console.log(thisUser)

      if(thisUser._hostID == this.hostID){
        this.isScooterOwner = true;
      }
    })
  }


  checkSuccessUrl(){

    this.route.queryParams.subscribe(params => {
      this.addSuccess = params['success'];
    })
  }

}
