import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isAlert = new Subject<any>();
  isRemoveFooter = new BehaviorSubject(false);
  isLoading = new BehaviorSubject(false);
  isLoadingLine = new BehaviorSubject(false);
  constructor() { }
}
