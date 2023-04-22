import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HostService} from "../../../host/services/host.service";
import {Host} from "../../../host/models/host.interface";
import {Escooter} from "../../../escooter/models/escooter.interface";

@Component({
  selector: 'host-details-card',
  templateUrl: './host-details-card.component.html',
  styleUrls: ['./host-details-card.component.css']
})
export class HostDetailsCardComponent implements OnInit {

  @Input() host:Host;
  @Input() escooter:Escooter;
  @Output() onHostInit: EventEmitter<Host> = new EventEmitter<Host>();


  constructor(private hostService:HostService) { }

  ngOnInit(): void {

  }




}
