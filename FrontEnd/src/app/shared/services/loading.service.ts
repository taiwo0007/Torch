import {DoCheck, Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements DoCheck, OnInit, OnChanges{

  isAlert = new Subject<any>();
  isError= new Subject<any>();
  isNotice= new Subject<any>();
  isSuccess= new Subject<any>();
  isRemoveFooter = new BehaviorSubject(false);
  isLoading = new BehaviorSubject(false);
  isLoadingLine = new BehaviorSubject(false);
  constructor() { }

  ngDoCheck() {

    console.log("loadingService: loading" +this.isLoading);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("loadingService: loading" +this.isLoading);

  }

  ngOnInit() {
    console.log("loadingService: loading" +this.isLoading);

  }
}
