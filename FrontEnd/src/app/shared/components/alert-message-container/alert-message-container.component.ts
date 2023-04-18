import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-alert-message-container',
  templateUrl: './alert-message-container.component.html',
  styleUrls: ['./alert-message-container.component.css'],
  animations: [
    trigger('showHided', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0) !important'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateY(-20px) !important'
      })),
      transition('show => hide', animate('200ms ease-in-out')),
      transition('hide => show', animate('200ms ease-in-out')),

    ])
  ]
})
export class AlertMessageContainerComponent implements OnInit{

  isError:boolean;
  isNotice:boolean;
  isSuccess:boolean;
  isAlert:boolean;
  alertMessage:String;

  constructor(private loadingService: LoadingService) {
  }

  ngOnInit() {

    //alerts
    this.loadingService.isNotice.subscribe(data => {
      this.isNotice = true;
      this.alertMessage = data.message;
      setTimeout(()=>{this.isNotice = false},
          5000)
    })
    this.loadingService.isAlert.subscribe(data => {
      this.isAlert = true;
      this.alertMessage = data.message;
      setTimeout(()=>{this.isAlert = false},
          5000)
    })
    this.loadingService.isError.subscribe(data => {
      this.isError = true;
      this.alertMessage = data.message;
      setTimeout(()=>{this.isError = false},
          5000)
    })
    this.loadingService.isSuccess.subscribe(data => {
      this.isSuccess = true;
      this.alertMessage = data.message;
      setTimeout(()=>{this.isSuccess = false},
          5000)
    })

  }


}
