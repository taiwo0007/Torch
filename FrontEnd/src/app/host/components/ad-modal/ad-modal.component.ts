import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../shared/services/loading.service";


@Component({
  selector: 'app-ad-modal',
  templateUrl: './ad-modal.component.html',
  styleUrls: ['./ad-modal.component.css']
})
export class AdModalComponent implements OnInit{

  @Output() userChoice = new EventEmitter<any>;

  constructor(private dialogRef: MatDialogRef<AdModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private loadingService:LoadingService) {

  }

  ngOnInit() {
    console.log(this.data)
  }

  panelOpenState = true;

  step = 0;
  days: number = 1;
  adDate:any = new Date();
  isLoading: boolean = false;
  today  = new Date();

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

    if(!myform.valid){
      this.loadingService.isNotice.next({message: "Please enter in an ad date"})
      return
    }
    this.isLoading = true
    console.log(myform.value)
    this.userChoice.emit({adDays: this.days, adDate: this.adDate, escooterId: this.data.escooter.id, hostId: this.data.escooter.host});
    console.log(this.days)

  }
}
