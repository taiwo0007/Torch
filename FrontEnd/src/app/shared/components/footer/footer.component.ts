import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  isLoadingLine: boolean = false;
  isLoading: boolean = false;
  isRemove: boolean = false;
  subs$: Subscription;

  constructor(private loadingService:LoadingService) { }

  ngOnInit(): void {

    this.subs$ = this.loadingService.isRemoveFooter.subscribe(data => {
      this.isRemove = data;
    })

    this.loadingService.isLoading.subscribe(value => {
      this.isLoading = value;
    })
    this.loadingService.isLoadingLine.subscribe(value => {
      this.isLoadingLine = value;
    })
  }

  ngOnDestroy() {

    this.subs$.unsubscribe();
  }

}
