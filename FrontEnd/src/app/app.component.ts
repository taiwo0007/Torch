import { Component } from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'torch-front-end';
  isAuthUrl = false;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.authService.autoLogin();

    this.route.params.subscribe((params) => {
      console.log(params, this.router.url)
      this.router.url
    })
  }



}
