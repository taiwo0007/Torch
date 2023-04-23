import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogService{
  confirmTripComplete = new Subject<boolean>()
  confirmTripCancel = new Subject<boolean>()
  confirmDeleteScooter = new Subject<any>();
  constructor() {
  }







}
