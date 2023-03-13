import { Component } from '@angular/core';
import {DialogService} from "../../services/dialog.service";

@Component({
  selector: 'app-are-you-sure-dialog-cancel',
  templateUrl: './are-you-sure-dialog-cancel.component.html',
  styleUrls: ['./are-you-sure-dialog-cancel.component.css']
})
export class AreYouSureDialogCancelComponent {

    constructor(private dialogService:DialogService ) {
    }
    cancelTrip() {

        this.dialogService.confirmTripCancel.next(true);

    }
}
