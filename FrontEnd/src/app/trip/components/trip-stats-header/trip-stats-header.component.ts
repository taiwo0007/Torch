import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'trip-stats-header',
  templateUrl: './trip-stats-header.component.html',
  styleUrls: ['./trip-stats-header.component.css']
})
export class TripStatsHeaderComponent implements OnInit {

  @Input() totalTrips:number;
  @Input() onGoingTrips:number;
  @Input() completedTrips:number;
  @Input() daysLeft:number;
  @Input() cancelledTrips:number;
  @Input() cancelledRecentlyTrips:number;


  constructor() { }

  ngOnInit(): void {
    console.log(this.cancelledRecentlyTrips)
  }

}
