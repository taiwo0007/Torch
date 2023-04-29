import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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


  @Input()  host: Host;
  hostObserver;
  @Output() onInit: EventEmitter<any> = new EventEmitter<any>();

  @Output() onHostRetrieved:EventEmitter<Host> = new EventEmitter<Host>()


  constructor(private hostService:HostService,
              private escooterService: EscooterService,
              ) { }

  ngOnInit(): void {
    this.onInit.next(true);

  }

  ngAfterContentInit() {



  }

}
