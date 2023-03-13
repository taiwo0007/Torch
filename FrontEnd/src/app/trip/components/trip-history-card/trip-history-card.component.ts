import {Component, Input, OnInit} from '@angular/core';
import {Trip} from "../../models/trip";

@Component({
  selector: 'trip-history-card',
  templateUrl: './trip-history-card.component.html',
  styleUrls: ['./trip-history-card.component.css']
})
export class TripHistoryCardComponent implements OnInit {
  @Input() trips: Trip[];
  @Input() isHost:boolean;

  constructor() { }

  ngOnInit(): void {

    console.log(this.trips)
  }

  trackByFn(index: number, trip: any) {
    return trip.id;
  }

}
