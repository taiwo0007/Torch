import {Component, Input, OnInit} from '@angular/core';import {HttpClient} from "@angular/common/http";
import {StripeService} from "ngx-stripe";
import {LoadingService} from "../../../shared/services/loading.service";
import {environment} from "../../../../environments/environment";
import {switchMap} from "rxjs";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.css']
})
export class SubscriptionModalComponent implements OnInit{
  priceId: any;
  session:any;
  userEmail:string;
  constructor(
      private stripeService: StripeService,
      private loadingService: LoadingService,
      private userService:UserService,
      private authService:AuthService
  ) {
  }

  ngOnInit() {
    let user = this.authService.user;

    this.authService.user.subscribe(user => {
      this.userEmail = user.email;
    })
  }

    checkout(price_id:any) {
    this.loadingService.isLoadingLine.next(true);

    let email = this.userEmail;

    // Check the server.js tab to see an example implementation
    this.userService.createCheckoutSessionFromAPI({price_id, email})
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
