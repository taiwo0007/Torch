import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {switchMap} from "rxjs";
import {LoadingService} from "../../../shared/services/loading.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit{

  paramId:number;

  constructor(private route:ActivatedRoute, private router:Router,
              private authService:AuthService,
              private loadingService:LoadingService) {
  }

  ngOnInit() {

    this.loadingService.isLoading.next(true);

    this.route.params.pipe(switchMap(params => {
      return this.authService.verifyEmailCode(params['code']);
    })).subscribe( params => {
      this.paramId = params['code'];
      this.authService.saveLocalVerifyInfo();
      this.loadingService.isLoading.next(false);


    },
        error => {
          this.loadingService.isLoading.next(false);

        })





  }

}
