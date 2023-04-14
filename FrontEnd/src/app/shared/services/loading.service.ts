import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isRemoveFooter = new BehaviorSubject(false);
  isLoading = new BehaviorSubject(false);
  isLoadingLine = new BehaviorSubject(false);
  constructor() { }
}
