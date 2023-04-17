import {Component, Input, OnInit} from '@angular/core';
import {ScooterReviewer} from "../../models/scooter-reviewer.interface";

@Component({
  selector: 'app-review-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css']
})
export class ReviewsListComponent implements OnInit {

  @Input() ReviewList:ScooterReviewer[];
  tempList:ScooterReviewer[];
  isShown:boolean = false;


  constructor() { }

  ngOnInit(): void {
    console.log(this.ReviewList)

    if(this.ReviewList.length > 3){
      this.tempList = this.ReviewList;
      this.ReviewList = this.ReviewList.slice(0, 3);

      console.log("Before review lsit"+this.tempList)
      console.log("After review list"+this.ReviewList)
    }

  }

  closeAllReviews(){
    this.ReviewList = this.ReviewList.slice(0, 3);
this.isShown = false;
  }

  showAllReviews() {
    this.ReviewList = this.tempList;
    this.isShown = true
  }
}
