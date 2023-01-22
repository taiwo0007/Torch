import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {NgForm} from "@angular/forms";
import {EscooterService} from "../../services/escooter.service";
import {ScooterReviewRequestPayload} from "../../payloads/scooter-review.payload";

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  @Input() escooterId:number;
  isSubmitted = false;

  scooterReviewRequestPayload:ScooterReviewRequestPayload = {
      comment: '',
      starRating: 0,
      escooterId: null

  };

  constructor(private authService:AuthService,
              private escooterService:EscooterService) { }

  ngOnInit(): void {
    console.log(this.escooterId)
    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )

      this.scooterReviewRequestPayload.escooterId = this.escooterId;

  }

  ngOnDestroy() {
      this.isSubmitted = false;
  }

    onSubmit(ReviewForm: NgForm) {

      this.scooterReviewRequestPayload.escooterId = this.escooterId;
        this.scooterReviewRequestPayload.comment = ReviewForm.value.comment;
        this.scooterReviewRequestPayload.starRating = ReviewForm.value.starRating;

        console.log(this.scooterReviewRequestPayload)

    this.escooterService.createReview(this.scooterReviewRequestPayload).subscribe( (data) => {
            console.log(data)

        this.escooterService.EscooterChangeEmitter.next(true);

            ReviewForm.resetForm();
            this.isSubmitted = true;
    })

      setTimeout(()=> this.isSubmitted = false,5000)


  }
}
