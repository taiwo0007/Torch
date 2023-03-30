import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Escooter} from "../../../escooter/models/escooter.interface";
import {NgForm} from "@angular/forms";
import {data} from "autoprefixer";

@Component({
  selector: 'app-ad-modal',
  templateUrl: './ad-modal.component.html',
  styleUrls: ['./ad-modal.component.css']
})
export class AdModalComponent implements OnInit{

  @Output() userChoice = new EventEmitter<any>;

  constructor(private dialogRef: MatDialogRef<AdModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    console.log(this.data)
  }

  panelOpenState = true;

  step = 0;
  days: number = 1;
  adDate:any = new Date();
  isLoading: boolean = false;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;

    // if(this.step == 2){}



  }

  prevStep() {
    this.step--;
  }

  onSumbit(myform: NgForm) {
    this.isLoading = true
    console.log(myform.value)
    this.userChoice.emit({adDays: this.days, adDate: this.adDate, escooterId: this.data.escooter.id, hostId: this.data.escooter.host});
    console.log(this.days)

  }
}
