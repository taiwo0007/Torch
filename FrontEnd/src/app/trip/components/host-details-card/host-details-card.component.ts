import {Component, Input, OnInit} from '@angular/core';
import {HostService} from "../../../host/services/host.service";
import {Host} from "../../../host/models/host.interface";
import {Escooter} from "../../../escooter/models/escooter.interface";

@Component({
  selector: 'host-details-card',
  templateUrl: './host-details-card.component.html',
  styleUrls: ['./host-details-card.component.css']
})
export class HostDetailsCardComponent implements OnInit {

  @Input() hostId:any;
  @Input() escooter:Escooter;
  host: Host;

  constructor(private hostService:HostService) { }

  ngOnInit(): void {

    console.log("Data")
    console.log(this.hostId);
    console.log(this.escooter);


    this.getHostData();
  }


  getHostData(){
    console.log("a")
    this.hostService.getHostById(this.hostId).subscribe((hostData:any) => {

      this.host = hostData;

    })
  }

}
