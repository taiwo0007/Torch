import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {DialogService} from "../../services/dialog.service";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";

@Component({
  selector: 'app-delete-scooter-dialog',
  templateUrl: './delete-scooter-dialog.component.html',
  styleUrls: ['./delete-scooter-dialog.component.css']
})
export class DeleteScooterDialogComponent {
  @Output() userChoice = new EventEmitter<any>;

  constructor(private dialogRef: MatDialogRef<DeleteScooterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dialogService:DialogService ) {
  }

  deleteScooter() {
    this.dialogService.confirmDeleteScooter.next(true);
    this.userChoice.emit(true)

  }
}
