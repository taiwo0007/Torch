import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Escooter} from "../../../escooter/models/escooter.interface";

@Component({
  selector: 'app-ad-modal',
  templateUrl: './ad-modal.component.html',
  styleUrls: ['./ad-modal.component.css']
})
export class AdModalComponent implements OnInit{

  @Output() userChoice = new EventEmitter<any>;

  constructor(private dialogRef: MatDialogRef<AdModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {escooter:Escooter}) {

  }

  ngOnInit() {
    console.log(this.data)
  }

  panelOpenState = true;

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    this.userChoice.emit("User choice test data.");

  }

  prevStep() {
    this.step--;
  }

}
