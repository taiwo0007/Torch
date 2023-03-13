import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogService implements OnDestroy{
  confirmTripComplete = new Subject<boolean>()
  confirmTripCancel = new Subject<boolean>()
  constructor() {
  }


  ngOnDestroy() {
    this.confirmTripComplete.unsubscribe();
    this.confirmTripCancel.unsubscribe();

  }


}
