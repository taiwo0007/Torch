import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html',
  styleUrls: ['./cookie-notice.component.css']
})
export class CookieNoticeComponent {

  @Output() onConsent:EventEmitter<boolean> = new EventEmitter<boolean>();

  onConsented(consent:boolean){
    console.log("hello")
    this.onConsent.emit(consent);
  }

}
