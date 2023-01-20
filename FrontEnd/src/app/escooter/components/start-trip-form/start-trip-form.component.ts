import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-start-trip-form',
  templateUrl: './start-trip-form.component.html',
  styleUrls: ['./start-trip-form.component.css']
})
export class StartTripFormComponent implements OnInit {
  isAuthenticated = false;
  @Input() cost;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.user.subscribe((data:boolean) => {

      this.isAuthenticated = data;
    })

  }

}
