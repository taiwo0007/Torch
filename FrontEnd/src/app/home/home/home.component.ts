import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAuthenticated = false;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe((data:boolean) => this.isAuthenticated = data )

  }

}
