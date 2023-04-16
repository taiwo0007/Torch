import {Component, DoCheck, EventEmitter, Inject, Injectable, OnInit, Output} from '@angular/core';
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import { MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

import {Router} from "@angular/router";
import {TripService} from "../../../trip/services/trip.service";
import {DialogService} from "../../services/dialog.service";


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
