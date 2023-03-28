import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Escooter} from "../../../escooter/models/escooter.interface";

@Component({
  selector: 'host-escooter-card',
  templateUrl: './host-escooter-card.component.html',
  styleUrls: ['./host-escooter-card.component.css']
})
export class HostEscooterCardComponent {

  @Input() escooter:Escooter;
  @Input() isScooterOwner:boolean = false;
  @Output() adClick: EventEmitter<Escooter> = new EventEmitter<Escooter>();

  onAddClick(){
    this.adClick.emit(this.escooter)
  }


}
