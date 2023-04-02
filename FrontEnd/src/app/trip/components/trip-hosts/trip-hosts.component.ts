import {Component, OnInit} from '@angular/core';
import {HostService} from "../../../host/services/host.service";
import {Host} from "../../../host/models/host.interface";
import {Trip} from "../../models/trip";

@Component({
  selector: 'app-trip-hosts',
  templateUrl: './trip-hosts.component.html',
  styleUrls: ['./trip-hosts.component.css']
})
export class TripHostsComponent implements OnInit{

  hostDetails:Host;
  hostTrips;

  constructor(private hostService:HostService) {
  }


  ngOnInit() {
    this.getHostDetails();
  }


  getHostDetails(){
    this.hostService.fetchHostDataByUserToken().subscribe((apiData:Host) => {
      this.hostDetails = apiData;
      this.hostTrips = apiData.hostTrips.length == 0 ? null : apiData.hostTrips;

      console.log(apiData)
      console.log(this.hostDetails);
    })

  }




}
