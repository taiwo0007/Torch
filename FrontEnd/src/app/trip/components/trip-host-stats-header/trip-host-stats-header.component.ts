import {Component, Input} from '@angular/core';

@Component({
  selector: 'trip-host-stats-header',
  templateUrl: './trip-host-stats-header.component.html',
  styleUrls: ['./trip-host-stats-header.component.css']
})
export class TripHostStatsHeaderComponent {


  @Input() totalHostTrips:number;
  @Input() escootersInUse:number;
  @Input() escootersNotInUse:number;
  @Input() earned:number;
  @Input() cancelled:number;
  @Input() cancelledRecently:number;

}
