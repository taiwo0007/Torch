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

    this.ReviewList = this.ReviewList.sort((a,b)=>{
      const dt1 = Date.parse(""+a.reviewDate);
      const dt2 = Date.parse(""+b.reviewDate);

      if (dt1 < dt2) return 1;
      if (dt1 > dt2) return -1;
      return 0;
    });

    console.log(this.sortedList)

  }

}
