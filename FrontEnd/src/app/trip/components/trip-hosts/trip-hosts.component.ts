import {Component, OnInit} from '@angular/core';
import {HostService} from "../../../host/services/host.service";
import {Host} from "../../../host/models/host.interface";
import {Trip} from "../../models/trip";
import {LoadingService} from "../../../shared/services/loading.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-trip-hosts',
  templateUrl: './trip-hosts.component.html',
  styleUrls: ['./trip-hosts.component.css']
})
export class TripHostsComponent implements OnInit{

  hostDetails:Host;
  hostTrips;
  isLoading:boolean = false;

  constructor(private hostService:HostService, private loadingService:LoadingService) {
  }


  ngOnInit() {
    this.isLoading = true;
    this.loadingService.isLoading.next(true);
    this.getHostDetails();
  }


  getHostDetails(){
    this.hostService.fetchHostDataByUserToken().subscribe((apiData:Host) => {
      this.isLoading = false;

      this.hostDetails = apiData;
      this.hostTrips = apiData.hostTrips.length == 0 ? null : apiData.hostTrips;

      console.log(apiData)
      console.log(this.hostDetails);
    })

  }




}
