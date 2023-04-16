import {Component, DoCheck, Inject, OnInit} from '@angular/core';

import {DialogService} from "../../services/dialog.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.css']
})
export class AreYouSureDialogComponent implements OnInit, DoCheck{

  @Inject(MAT_DIALOG_DATA) public data: any;
  constructor(public dialog: MatDialog,
              private dialogService:DialogService) {}

  ngOnInit(): void {
    console.log(this.data)
    }

    ngDoCheck() {
    console.log(this.data)
    }


  completeTrip() {
    this.dialogService.confirmTripComplete.next(true);


  }
}
