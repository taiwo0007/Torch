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

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    console.log("Reviewer id",this.Review.scooter_reviewer)
    this.userService.fetchBasicUser(this.Review.scooter_reviewer).subscribe((data:BasicUserResponsePayload) => {

      this.reviewUser = data;

      console.log("reivewUser",data)
    })
  }

}
