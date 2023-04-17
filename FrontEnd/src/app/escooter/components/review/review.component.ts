import {Component, Input, OnInit} from '@angular/core';
import {ScooterReviewer} from "../../models/scooter-reviewer.interface";
import {UserService} from "../../../user/services/user.service";
import {BasicUserResponsePayload} from "../../../user/models/basic-user-response.payload";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() Review:ScooterReviewer;
  reviewUser:BasicUserResponsePayload;
   ratingList: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.fetchBasicUser(this.Review.scooter_reviewer).subscribe((data:BasicUserResponsePayload) => {

      this.reviewUser = data;
      this.initRatingList();

      console.log("reivewUser",data)
    })
  }


  initRatingList() {

    let tempList = []
      for(let i = 0; i < this.Review.starRating; i++){
        tempList.push(1)
      }

      this.ratingList = tempList;

     console.log(this.ratingList)

  }

}
