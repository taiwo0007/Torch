import {Component, Input, OnInit} from '@angular/core';
import {ScooterReviewer} from "../../models/scooter-reviewer.interface";

@Component({
  selector: 'app-review-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css']
})
export class ReviewsListComponent implements OnInit {

  @Input() ReviewList:ScooterReviewer[];
  sortedList: ScooterReviewer[];
  constructor() { }

  ngOnInit(): void {



    console.log(this.sortedList)

  }

}
