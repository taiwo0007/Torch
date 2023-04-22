import {DoCheck, Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isAlert = new Subject<any>();
  isError= new Subject<any>();
  isNotice= new Subject<any>();
  isSuccess= new Subject<any>();
  isRemoveFooter = new BehaviorSubject(false);
  isLoading = new BehaviorSubject(false);
  isLoadingLine = new BehaviorSubject(false);
  constructor() { }


}
