import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {HostService} from "../../../host/services/host.service";
import {EscooterService} from "../../services/escooter.service";
import {Host} from "../../../host/models/host.interface";
import {LoadingService} from "../../../shared/services/loading.service";

@Component({
  selector: 'app-mini-host-card',
  templateUrl: './mini-host-card.component.html',
  styleUrls: ['./mini-host-card.component.css']
})
export class MiniHostCardComponent implements OnInit, AfterContentInit {

  @Input() HostId;
  host: Host;
  hostObserver;


  constructor(private hostService:HostService,
              private escooterService: EscooterService,
              ) { }

  ngOnInit(): void {


    console.log("this.hostId", this.HostId)

      this.hostObserver = this.hostService.getHostById(this.HostId).subscribe((data:Host) => {

        this.host = data;
        console.log("Api Host data",this.host)



      }, ()=> {

      }, () => {

      })







  }

  ngAfterContentInit() {



  }

}
