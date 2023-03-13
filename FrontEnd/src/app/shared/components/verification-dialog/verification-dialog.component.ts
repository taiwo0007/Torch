import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-verification-dialog',
  templateUrl: './verification-dialog.component.html',
  styleUrls: ['./verification-dialog.component.css']
})
export class VerificationDialogComponent {

    constructor(private authService:AuthService) {
    }

    onVerifyConsented() {
        this.authService.onVerifyConsent();
    }
}
