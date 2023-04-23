import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogService} from "../../services/dialog.service";

@Component({
  selector: 'app-are-you-sure-dialog-cancel',
  templateUrl: './are-you-sure-dialog-cancel.component.html',
  styleUrls: ['./are-you-sure-dialog-cancel.component.css']
})
export class AreYouSureDialogCancelComponent implements OnInit{
    @ViewChild('dialogCancel') dialiogCancel: any;
    isShowing:boolean;
    ngOnInit() {
        this.isShowing = true;
    }

    constructor(private dialogService:DialogService ) {
    }
    cancelTrip() {

        // this.dialiogCancel.nativeElement.style.display = 'none'
        this.isShowing = false;
        this.dialogService.confirmTripCancel.next(true);
    }
}
