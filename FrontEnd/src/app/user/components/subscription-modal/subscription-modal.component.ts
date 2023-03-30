import {Component, Input, OnInit} from '@angular/core';import {HttpClient} from "@angular/common/http";
import {StripeService} from "ngx-stripe";
import {LoadingService} from "../../../shared/services/loading.service";
import {environment} from "../../../../environments/environment";
import {switchMap} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.css']
})
export class SubscriptionModalComponent implements OnInit{
  priceId: any;
  session:any;
  constructor(
      private stripeService: StripeService,
      private loadingService: LoadingService,
      private userService:UserService
  ) {
  }

  ngOnInit() {

  }

    checkout(price_id:any) {
    this.loadingService.isLoadingLine.next(true);
    // Check the server.js tab to see an example implementation
    this.userService.createCheckoutSessionFromAPI(price_id)
        .subscribe(result => {
          this.loadingService.isLoadingLine.next(false);
          // If `redirectToCheckout` fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using `error.message`.
          if (result.error) {
            this.loadingService.isLoadingLine.next(false);
            alert(result.error.message);
          }
        });
  }
}
