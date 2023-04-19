import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {Subscription} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {constructorParametersDownlevelTransform} from "@angular/compiler-cli";

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
   isSearchUrl: boolean = false;

  constructor(private loadingService:LoadingService, private router:Router) { }

  ngOnInit(): void {

    this.router.events.subscribe(events => {
      console.log(events)
      if(events instanceof NavigationStart){
        console.log(events.url)
        if(events.url.includes('/results') ){
          console.log("truuuuuuuuuuuue")
          this.isSearchUrl = true;
          return;
        }
        else {
          console.log("faaaaaaaaaaaaleeeee")

          this.isSearchUrl = false;

        }
      }
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
