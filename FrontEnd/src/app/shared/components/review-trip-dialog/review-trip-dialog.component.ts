import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-review-trip-dialog',
  templateUrl: './review-trip-dialog.component.html',
  styleUrls: ['./review-trip-dialog.component.css']
})
export class ReviewTripDialogComponent {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;


  constructor(private authService:AuthService, private _formBuilder: FormBuilder) {
  }

  onVerifyConsented() {
    this.authService.onVerifyConsent();
  }
}
