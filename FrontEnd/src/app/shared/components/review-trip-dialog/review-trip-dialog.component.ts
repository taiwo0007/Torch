import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-review-trip-dialog',
  templateUrl: './review-trip-dialog.component.html',
  styleUrls: ['./review-trip-dialog.component.css']
})
export class ReviewTripDialogComponent implements OnInit{

  public form: FormGroup;
  @Output() userReview = new EventEmitter<any>;

  firstFormGroup = this._formBuilder.group({
    host_starRating: ['', Validators.required],
    host_comment: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    escooter_starRating: ['', Validators.required],
    escooter_comment: ['', Validators.required],
  });

  isLinear = true;
  isLoading: any;


  constructor(private authService:AuthService, private _formBuilder: FormBuilder) {
  }

  onVerifyConsented() {
    this.authService.onVerifyConsent();
  }

  ngOnInit() {
  }

  onSubmit() {


    if(this.firstFormGroup.invalid || this.secondFormGroup.invalid){
      return;
    }
    this.isLoading = true;

    this.userReview.emit({...this.firstFormGroup.value,...this.secondFormGroup.value})



  }
}
