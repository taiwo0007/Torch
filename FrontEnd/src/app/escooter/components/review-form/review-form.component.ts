import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
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
  public form: FormGroup;

  scooterReviewRequestPayload:ScooterReviewRequestPayload = {
      comment: '',
      starRating: 0,
      escooterId: null

  };
    isLoading: boolean = false;

  constructor(private authService:AuthService,
              private escooterService:EscooterService,
              private fb: FormBuilder) {


      this.form = this.fb.group({
          starRating: ['', Validators.required],
          comment: ['', Validators.required]

      })
  }

  ngOnInit(): void {
    console.log(this.escooterId)
    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )

      this.scooterReviewRequestPayload.escooterId = this.escooterId;

  }

  ngOnDestroy() {
      this.isSubmitted = false;
  }



    onSubmit() {
      this.isLoading = true;

      if(this.form.invalid){
          return
      }

      this.scooterReviewRequestPayload.escooterId = this.escooterId;
        this.scooterReviewRequestPayload.comment = this.form.value.comment;
        this.scooterReviewRequestPayload.starRating = this.form.value.starRating;

        console.log(this.scooterReviewRequestPayload)

    this.escooterService.createReview(this.scooterReviewRequestPayload).subscribe( (data) => {
            console.log(data)

        this.escooterService.EscooterChangeEmitter.next(true);

            this.form.reset();
            this.isSubmitted = true;
            this.isLoading = false;
    })

      // setTimeout(()=> this.isSubmitted = false,5000)


  }
}
